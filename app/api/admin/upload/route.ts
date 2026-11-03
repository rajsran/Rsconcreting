import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { checkAdminRequest } from '@/lib/adminAuth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!checkAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get('file') as Blob | null;
    const pathname = form.get('pathname') as string | null;

    if (!file || !pathname) {
      return NextResponse.json({ error: 'Missing file or pathname' }, { status: 400 });
    }

    const blob = await put(pathname, file, {
      access: 'public',
      contentType: 'image/jpeg',
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
