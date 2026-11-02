import { getProject } from '@/lib/projects';
import { notFound } from 'next/navigation';
import EditProjectClient from './EditProjectClient';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return <EditProjectClient project={project} />;
}
