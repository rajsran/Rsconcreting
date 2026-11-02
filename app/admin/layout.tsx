import { isAdminAuthenticated } from '@/lib/adminAuth';
import { getAdminCounts } from '@/lib/leads';
import AdminNav from '@/components/admin/AdminNav';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Admin', robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Only load numbers for a logged-in admin (the login page gets no data)
  const authed = await isAdminAuthenticated();
  const counts = authed ? await getAdminCounts() : null;

  return (
    <div className="min-h-screen bg-cream-50">
      {counts && <AdminNav newLeads={counts.newLeads} newMessages={counts.newMessages} />}
      {children}
    </div>
  );
}
