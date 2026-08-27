import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Outbound: Investigator triggers a disclosure or freeze request to a VASP via SAHYOG
// POST body: { case_id, vasp_address, vasp_name, action: 'disclosure' | 'freeze', legal_basis }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      case_id,
      vasp_address,
      vasp_name,
      action = 'disclosure',
      legal_basis = 'Section 94 BNSS / Section 79(3)(b) IT Act'
    } = body;

    if (!case_id || !vasp_address) {
      return NextResponse.json({ error: 'case_id and vasp_address are required' }, { status: 400 });
    }

    // Fetch the case to include wallet info in the request log
    const { data: caseData } = await supabaseAdmin
      .from('cases')
      .select('wallet_address, chain, crime_category')
      .eq('id', case_id)
      .single();

    // Log the disclosure request (in a real system, this would fire an HTTP call to the SAHYOG API)
    const disclosureRequest = {
      request_type: action,
      case_id,
      suspect_wallet: caseData?.wallet_address || 'unknown',
      chain: caseData?.chain || 'unknown',
      target_vasp: vasp_name || vasp_address,
      vasp_address,
      legal_basis,
      crime_category: caseData?.crime_category || 'unknown',
      submitted_at: new Date().toISOString(),
      status: 'submitted_mock',
      reference_number: `SAHYOG-${Date.now()}`
    };

    console.log('[SAHYOG] Disclosure request submitted:', disclosureRequest);

    // In production, this would be:
    // await fetch('https://sahyog.gov.in/api/disclosure-request', { method: 'POST', body: JSON.stringify(disclosureRequest), ... })

    return NextResponse.json({
      success: true,
      message: `${action === 'freeze' ? 'Freeze' : 'Disclosure'} request submitted to SAHYOG (mock).`,
      reference_number: disclosureRequest.reference_number,
      submitted_at: disclosureRequest.submitted_at,
      target_vasp: disclosureRequest.target_vasp
    });

  } catch (error: any) {
    console.error('SAHYOG disclosure-request error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
