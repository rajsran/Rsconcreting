import { isAdminAuthenticated } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  redirect(authed ? '/admin/dashboard' : '/admin/login');
}
