import { NextResponse } from 'next/server';
import { getHeroImages } from '@/lib/hero';

export const runtime = 'nodejs';

export async function GET() {
  const urls = await getHeroImages();
  return NextResponse.json({ urls });
}
