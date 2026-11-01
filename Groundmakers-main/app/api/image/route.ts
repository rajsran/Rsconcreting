import { NextRequest, NextResponse } from 'next/server';
import { get } from '@vercel/blob';

export const runtime = 'nodejs';

const PRIVATE_BLOB_RE = /^[a-z0-9]+\.private\.blob\.vercel-storage\.com$/;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return new NextResponse('Missing url', { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new NextResponse('Invalid url', { status: 400 });
  }

  if (!PRIVATE_BLOB_RE.test(parsed.hostname)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const result = await get(url, { access: 'private' });
    if (!result) return new NextResponse('Not found', { status: 404 });

    const headers = new Headers();
    const ct = result.blob.contentType;
    if (ct) headers.set('content-type', ct);
    headers.set('cache-control', 'public, max-age=31536000, immutable');

    return new NextResponse(result.stream, { headers });
  } catch {
    return new NextResponse('Error fetching blob', { status: 500 });
  }
}
