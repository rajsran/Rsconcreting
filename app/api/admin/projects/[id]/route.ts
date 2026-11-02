import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { checkAdminRequest } from '@/lib/adminAuth';
import { deleteProject, saveProject, getProject, type Project } from '@/lib/projects';

export const runtime = 'nodejs';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const existing = await getProject(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json() as {
    title: string;
    description: string;
    imageUrls: string[];
    removedUrls: string[];
  };

  // Delete removed images from Vercel Blob
  if (body.removedUrls?.length) {
    await Promise.all(body.removedUrls.map(url => del(url)));
  }

  const updated: Project = {
    ...existing,
    title: body.title,
    description: body.description,
    imageUrls: body.imageUrls,
  };
  await saveProject(updated);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
