import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch case details
    const { data: caseObj, error: caseError } = await supabaseAdmin
      .from('cases')
      .select('*')
      .eq('id', id)
      .single();

    if (caseError || !caseObj) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Fetch corresponding attribution details (safely get latest to avoid errors on duplicates)
    const { data: attributions } = await supabaseAdmin
      .from('attributions')
      .select('*')
      .eq('case_id', id)
      .order('created_at', { ascending: false })
      .limit(1);

    const attribution = attributions?.[0] || null;

    return NextResponse.json({
      case: caseObj,
      attribution: attribution || null
    });
  } catch (error: any) {
    console.error('Case fetch API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
