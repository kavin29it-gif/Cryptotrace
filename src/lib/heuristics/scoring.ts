/**
 * VASP Attribution Scoring Engine
 * Based on PRD §15 + multi-signal evidence weighting
 *
 * Signals:
 *  1. Direct VASP deposit match      → base score
 *  2. Hop distance penalty           → reduces confidence at 1-hop, 2-hop
 *  3. Mixer/bridge traversal penalty → -25 per mixer hop
 *  4. Wallet cluster membership      → boosts or confirms attribution
 *  5. Transaction pattern            → round amounts, rapid pass-through (peeling chain)
 */

export interface Attribution {
  vasp_address: string;
  vasp_name: string;
  hop_distance: number;
  mixer_hops: number;
}

export interface ScoredAttribution {
  confidence: number;
  risk: 'high' | 'medium' | 'low';
  evidence: EvidenceSignal[];
  needsReview: boolean;
}

export interface EvidenceSignal {
  signal: string;
  description: string;
  weight: 'strong' | 'moderate' | 'weak' | 'penalty';
}

export function calculateVaspScore(
  attribution: Attribution,
  options?: {
    isInCluster?: boolean;
    hasPeelingChain?: boolean;
    hasRoundAmounts?: boolean;
    transactionCount?: number;
  }
): ScoredAttribution {
  const { isInCluster = false, hasPeelingChain = false, hasRoundAmounts = false, transactionCount = 0 } = options || {};

  const evidence: EvidenceSignal[] = [];

  // --- Signal 1: Base score by hop distance ---
  let baseScore = 0;
  if (attribution.hop_distance === 0) {
    baseScore = 100;
    evidence.push({ signal: 'Direct Deposit', description: 'Funds deposited directly to known VASP deposit wallet.', weight: 'strong' });
  } else if (attribution.hop_distance === 1) {
    baseScore = 70;
    evidence.push({ signal: '1-Hop to VASP', description: 'Funds moved through one intermediate wallet before reaching VASP.', weight: 'moderate' });
  } else if (attribution.hop_distance === 2) {
    baseScore = 40;
    evidence.push({ signal: '2-Hop to VASP', description: 'Funds passed through two intermediate wallets before VASP deposit.', weight: 'moderate' });
  } else {
    baseScore = 20;
    evidence.push({ signal: `${attribution.hop_distance}-Hop to VASP`, description: `Funds passed through ${attribution.hop_distance} wallets — longer path reduces confidence.`, weight: 'weak' });
  }

  // --- Signal 2: Wallet cluster match ---
  if (isInCluster) {
    baseScore += 10;
    evidence.push({ signal: 'Cluster Match', description: 'Destination wallet is part of a known VASP deposit cluster — strongly supports attribution.', weight: 'strong' });
  }

  // --- Signal 3: Transaction pattern — peeling chain ---
  if (hasPeelingChain) {
    evidence.push({ signal: 'Peeling Chain Detected', description: 'Funds split repeatedly through rapid sequential transactions — common obfuscation pattern.', weight: 'moderate' });
  }

  // --- Signal 4: Round amount flag ---
  if (hasRoundAmounts) {
    evidence.push({ signal: 'Round Amount Transactions', description: 'Suspicious round-number transfer amounts detected — common in structured layering.', weight: 'moderate' });
  }

  // --- Signal 5: High transaction volume ---
  if (transactionCount > 20) {
    evidence.push({ signal: 'High Activity Wallet', description: `${transactionCount} transactions found — consistent with exchange hot wallet or active intermediary.`, weight: 'moderate' });
  }

  // --- Penalty: Mixer/bridge traversal ---
  const mixerPenalty = attribution.mixer_hops * 25;
  if (attribution.mixer_hops > 0) {
    baseScore -= mixerPenalty;
    evidence.push({
      signal: 'Mixer/Bridge Traversal',
      description: `Funds passed through ${attribution.mixer_hops} known mixer or bridge address(es) — confidence reduced by ${mixerPenalty} points.`,
      weight: 'penalty'
    });
  }

  const confidence = Math.max(0, Math.min(100, baseScore));

  // Risk classification
  let risk: 'high' | 'medium' | 'low' = 'low';
  if (confidence >= 70) risk = 'high';
  else if (confidence >= 40) risk = 'medium';

  // Needs review if uncertain
  const needsReview = confidence < 40;

  return { confidence, risk, evidence, needsReview };
}

// Detect peeling chain pattern: rapid sequential single-output transactions
export function detectPeelingChain(transactions: Array<{ from_addr: string; to_addr: string; block_time: string }>): boolean {
  if (transactions.length < 3) return false;

  // Sort by time
  const sorted = [...transactions].sort((a, b) => new Date(a.block_time).getTime() - new Date(b.block_time).getTime());

  // Count rapid sequential pass-throughs (< 10 minutes apart)
  let rapidCount = 0;
  for (let i = 1; i < sorted.length; i++) {
    const timeDiff = new Date(sorted[i].block_time).getTime() - new Date(sorted[i - 1].block_time).getTime();
    if (timeDiff < 10 * 60 * 1000) rapidCount++;
  }

  return rapidCount >= 3;
}

// Detect round amounts pattern
export function detectRoundAmounts(transactions: Array<{ value: string }>): boolean {
  const roundCount = transactions.filter(tx => {
    const val = parseFloat(tx.value);
    return val > 0 && val % 1 === 0 && val >= 1;
  }).length;
  return roundCount / transactions.length > 0.5;
}
