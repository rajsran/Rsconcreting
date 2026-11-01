import { isAdminAuthenticated } from '@/lib/adminAuth';
import { listProjects } from '@/lib/projects';
import { getAdminCounts, listQuoteLeads, listContactMessages } from '@/lib/leads';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');

  // Each loader falls back to an empty result if the database is unavailable
  const [projects, counts, recentLeads, recentMessages] = await Promise.all([
    listProjects(),
    getAdminCounts(),
    listQuoteLeads(5),
    listContactMessages(5),
  ]);

  return (
    <AdminDashboardClient
      projects={projects}
      counts={counts}
      recentLeads={recentLeads}
      recentMessages={recentMessages}
    />
  );
}
