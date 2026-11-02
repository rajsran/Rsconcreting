import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { checkAdminRequest } from '@/lib/adminAuth';
import { getHeroImages, saveHeroImages } from '@/lib/hero';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!checkAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file') as Blob | null;
  if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 });

  const blob = await put(`hero/${Date.now()}.jpg`, file, {
    access: 'private',
    contentType: 'image/jpeg',
    addRandomSuffix: false,
  });

  const existing = await getHeroImages();
  await saveHeroImages([blob.url, ...existing]);

  return NextResponse.json({ url: blob.url });
}

export async function DELETE(req: NextRequest) {
  if (!checkAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { url } = await req.json() as { url: string };

  // Attempt blob deletion — ignore errors (blob may already be gone)
  try { await del(url); } catch {}

  // Always update meta.json so the URL is removed even if blob was already deleted
  const existing = await getHeroImages();
  await saveHeroImages(existing.filter(u => u !== url));

  return NextResponse.json({ ok: true });
}
