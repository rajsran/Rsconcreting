import { NextRequest, NextResponse } from 'next/server';

async function getExpectedToken(): Promise<string> {
  const data = new TextEncoder().encode(
    (process.env.ADMIN_PASSWORD ?? '') + 'gm-salt-v2'
  );
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('admin_token')?.value;
    const expected = await getExpectedToken();
    if (token !== expected) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
