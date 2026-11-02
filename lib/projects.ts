import { del } from '@vercel/blob';
import { getSql } from './db';

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  createdAt: string;
}

interface ProjectRow {
  id: string;
  title: string;
  description: string;
  image_urls: string[];
  created_at: Date | string;
}

function toProject(r: ProjectRow): Project {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    imageUrls: r.image_urls ?? [],
    createdAt: new Date(r.created_at).toISOString(),
  };
}

export async function listProjects(): Promise<Project[]> {
  try {
    const rows = (await getSql()`
      SELECT id, title, description, image_urls, created_at
      FROM projects ORDER BY created_at DESC`) as ProjectRow[];
    return rows.map(toProject);
  } catch (err) {
    // Database unavailable (e.g. DATABASE_URL not set) - show an empty list
    console.error('Failed to list projects:', err);
    return [];
  }
}

export async function getProject(id: string): Promise<Project | null> {
  const rows = (await getSql()`
    SELECT id, title, description, image_urls, created_at
    FROM projects WHERE id = ${id}`) as ProjectRow[];
  return rows[0] ? toProject(rows[0]) : null;
}

/** Insert a new project, or update it if the id already exists. */
export async function saveProject(project: Project): Promise<void> {
  await getSql()`
    INSERT INTO projects (id, title, description, image_urls, created_at)
    VALUES (${project.id}, ${project.title}, ${project.description},
            ${project.imageUrls}::text[], ${project.createdAt})
    ON CONFLICT (id) DO UPDATE SET
      title       = EXCLUDED.title,
      description = EXCLUDED.description,
      image_urls  = EXCLUDED.image_urls`;
}

export async function deleteProject(id: string): Promise<void> {
  const project = await getProject(id);
  await getSql()`DELETE FROM projects WHERE id = ${id}`;
  // Best-effort cleanup of the project's image files in Vercel Blob
  if (project?.imageUrls.length) {
    await Promise.all(project.imageUrls.map((url) => del(url).catch(() => {})));
  }
}
