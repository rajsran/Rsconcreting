import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export function getExpectedToken(): string {
  return createHash('sha256')
    .update((process.env.ADMIN_PASSWORD ?? '') + 'gm-salt-v2')
    .digest('hex');
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get('admin_token')?.value === getExpectedToken();
}

export function checkAdminRequest(req: NextRequest): boolean {
  return req.cookies.get('admin_token')?.value === getExpectedToken();
}
