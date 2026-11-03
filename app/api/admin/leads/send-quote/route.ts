import { NextRequest, NextResponse } from 'next/server';
import { checkAdminRequest } from '@/lib/adminAuth';
import { generateQuotePdf } from '@/lib/generateQuotePdf';
import { sendFinalQuoteEmail } from '@/lib/sendQuoteEmail';
import type { LineItem, QuoteLeadRecord } from '@/lib/leadTypes';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!checkAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { lead, lineItems } = await req.json() as { lead: QuoteLeadRecord; lineItems: LineItem[] };

    if (!lead?.email) {
      return NextResponse.json({ error: 'Customer has no email address' }, { status: 400 });
    }
    if (!lineItems?.length) {
      return NextResponse.json({ error: 'Add at least one line item' }, { status: 400 });
    }

    const pdfBuffer = await generateQuotePdf(lead as never, lineItems);
    await sendFinalQuoteEmail(lead, lineItems, pdfBuffer);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Send quote error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
