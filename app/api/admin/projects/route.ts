import { NextRequest, NextResponse } from 'next/server';
import { checkAdminRequest } from '@/lib/adminAuth';
import { saveProject, type Project } from '@/lib/projects';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!checkAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = (await req.json()) as Pick<Project, 'title' | 'description' | 'imageUrls'>;
  const project: Project = {
    ...data,
    id: `proj-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  await saveProject(project);
  return NextResponse.json({ ok: true, id: project.id });
}
