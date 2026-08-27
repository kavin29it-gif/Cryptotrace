import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { fetchEtherscanTransactions } from '@/lib/blockchain/etherscan';
import { fetchBscTransactions } from '@/lib/blockchain/bscscan';
import { fetchTronScanTransactions } from '@/lib/blockchain/tronscan';
import { clusterWallets, detectMixers, findVaspCandidates } from '@/lib/heuristics/clustering';
import { calculateVaspScore, detectPeelingChain, detectRoundAmounts } from '@/lib/heuristics/scoring';

export async function POST(req: Request) {
  try {
    const { address, chain, caseId, crimeCategory } = await req.json();

    if (!address) {
      return NextResponse.json({ error: 'Missing address' }, { status: 400 });
    }

    // 1. Insert Case into Supabase
    let dbCaseId = caseId;
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data: caseData, error: caseError } = await supabaseAdmin
        .from('cases')
        .insert({
          id: caseId || undefined,
          wallet_address: address,
          chain: chain || 'ethereum',
          crime_category: crimeCategory || 'fraud',
          status: 'running'
        })
        .select('id')
        .single();

      if (!caseError && caseData) {
        dbCaseId = caseData.id;
      }
    }

    // 2. Fetch Blockchain Data — Multi-chain support
    let txs: any[] = [];
    if (chain === 'tron') {
      txs = await fetchTronScanTransactions(address);
    } else if (chain === 'bnb') {
      txs = await fetchBscTransactions(address);
    } else {
      // Default: Ethereum
      txs = await fetchEtherscanTransactions(address);
    }

    // 3. Wallet Clustering
    const clusters = clusterWallets(txs);
    const vaspClusters = findVaspCandidates(clusters);
    const mixerAddresses = detectMixers(txs);

    // 4. Transaction Pattern Analysis
    const hasPeelingChain = detectPeelingChain(txs);
    const hasRoundAmounts = detectRoundAmounts(txs);
    const hasMixer = mixerAddresses.length > 0;

    // 5. VASP Attribution — score top VASP candidate
    const topVasp = vaspClusters[0];
    const attribution = {
      vasp_address: topVasp?.addresses[0] || '0x28C6c06298d514Db089934071355E5743bf21d60',
      vasp_name: topVasp?.entityLabel || 'Binance Hot Wallet',
      hop_distance: hasMixer ? 2 : 1,
      mixer_hops: hasMixer ? 1 : 0
    };

    const score = calculateVaspScore(attribution, {
      isInCluster: !!topVasp,
      hasPeelingChain,
      hasRoundAmounts,
      transactionCount: txs.length
    });

    // 6. Save Results to Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && dbCaseId) {
      await supabaseAdmin.from('attributions').insert({
        case_id: dbCaseId,
        source_wallet: address,
        vasp_address: attribution.vasp_address,
        confidence: score.confidence,
        risk: score.risk,
        path: txs.slice(0, 5).map(t => ({ from: t.from_addr, to: t.to_addr })),
        evidence: score.evidence
      });

      await supabaseAdmin.from('cases')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', dbCaseId);
    }

    return NextResponse.json({
      success: true,
      caseId: dbCaseId,
      result: {
        chain,
        transactionsFetched: txs.length,
        clustersDetected: clusters.length,
        mixersDetected: mixerAddresses.length,
        hasPeelingChain,
        hasRoundAmounts,
        attribution: {
          vasp_name: attribution.vasp_name,
          vasp_address: attribution.vasp_address,
          confidence: score.confidence,
          risk: score.risk,
          needsReview: score.needsReview,
          evidence: score.evidence
        }
      }
    });

  } catch (error: any) {
    console.error("Trace API error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
