import { listContactMessages } from '@/lib/leads';
import MessagesClient from './MessagesClient';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const messages = await listContactMessages();
  return <MessagesClient initial={messages} />;
}
