import { NextRequest, NextResponse } from 'next/server';
import { checkAdminRequest } from '@/lib/adminAuth';
import { LEAD_STATUSES, deleteQuoteLead, updateLeadStatus, type LeadStatus } from '@/lib/leads';

export const runtime = 'nodejs';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = Number((await params).id);
  const { status } = (await req.json()) as { status: LeadStatus };
  if (!Number.isInteger(id) || !LEAD_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  await updateLeadStatus(id, status);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  await deleteQuoteLead(id);
  return NextResponse.json({ ok: true });
}
