import { listQuoteLeads } from '@/lib/leads';
import LeadsClient from './LeadsClient';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const leads = await listQuoteLeads();
  return <LeadsClient initial={leads} />;
}
