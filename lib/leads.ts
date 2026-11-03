import { getSql } from './db';
import { QuoteLead, calcEstimate } from './pricing';

export interface ContactMessage {
  name: string;
  phone?: string;
  email?: string;
  service?: string;
  message: string;
}

const clean = (v: string | undefined | null, max = 500) => {
  const t = v?.trim().slice(0, max);
  return t ? t : null;
};

/** Store a quote lead from the "Get a Free Quote" popup. Returns the new row id. */
export async function saveQuoteLead(lead: QuoteLead): Promise<number> {
  const estimate = calcEstimate(lead);
  const rows = (await getSql()`
    INSERT INTO quote_leads
      (name, email, phone, postcode, service, type, size, timeline, estimate_low, estimate_high)
    VALUES
      (${clean(lead.name, 120)}, ${clean(lead.email, 200)}, ${clean(lead.phone, 40)},
       ${clean(lead.postcode, 10)}, ${clean(lead.service, 80)}, ${clean(lead.type, 120)},
       ${clean(lead.size, 120)}, ${clean(lead.timeline, 120)},
       ${estimate?.low ?? null}, ${estimate?.high ?? null})
    RETURNING id`) as { id: string | number }[];
  return Number(rows[0].id);
}

/** Store a message from the Contact page. Returns the new row id. */
export async function saveContactMessage(m: ContactMessage): Promise<number> {
  const rows = (await getSql()`
    INSERT INTO contact_messages (name, phone, email, service, message)
    VALUES (${clean(m.name, 120)}, ${clean(m.phone, 40)}, ${clean(m.email, 200)},
            ${clean(m.service, 80)}, ${clean(m.message, 5000)})
    RETURNING id`) as { id: string | number }[];
  return Number(rows[0].id);
}

// ─── Admin: reading and managing what was submitted ──────────────────────────

export * from './leadTypes';
import type { LeadStatus, MessageStatus, QuoteLeadRecord, ContactMessageRecord } from './leadTypes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

export async function listQuoteLeads(limit = 200): Promise<QuoteLeadRecord[]> {
  try {
    const rows = (await getSql()`
      SELECT id, created_at, name, email, phone, postcode, service, type, size, timeline,
             estimate_low, estimate_high, status
      FROM quote_leads ORDER BY created_at DESC LIMIT ${limit}`) as Row[];
    return rows.map((r) => ({
      id: Number(r.id),
      createdAt: new Date(r.created_at).toISOString(),
      name: r.name, email: r.email, phone: r.phone, postcode: r.postcode,
      service: r.service, type: r.type, size: r.size, timeline: r.timeline,
      estimateLow: r.estimate_low, estimateHigh: r.estimate_high,
      status: r.status,
    }));
  } catch (err) {
    console.error('Failed to list quote leads:', err);
    return [];
  }
}

export async function listContactMessages(limit = 200): Promise<ContactMessageRecord[]> {
  try {
    const rows = (await getSql()`
      SELECT id, created_at, name, phone, email, service, message, status
      FROM contact_messages ORDER BY created_at DESC LIMIT ${limit}`) as Row[];
    return rows.map((r) => ({
      id: Number(r.id),
      createdAt: new Date(r.created_at).toISOString(),
      name: r.name, phone: r.phone, email: r.email,
      service: r.service, message: r.message, status: r.status,
    }));
  } catch (err) {
    console.error('Failed to list contact messages:', err);
    return [];
  }
}

export interface AdminCounts {
  newLeads: number;
  totalLeads: number;
  newMessages: number;
  totalMessages: number;
  projects: number;
  heroPhotos: number;
}

const EMPTY_COUNTS: AdminCounts = { newLeads: 0, totalLeads: 0, newMessages: 0, totalMessages: 0, projects: 0, heroPhotos: 0 };

export async function getAdminCounts(): Promise<AdminCounts> {
  try {
    const sql = getSql();
    const [[l], [m], [p], [h]] = await sql.transaction([
      sql`SELECT count(*) FILTER (WHERE status = 'new')::int AS new, count(*)::int AS total FROM quote_leads`,
      sql`SELECT count(*) FILTER (WHERE status = 'new')::int AS new, count(*)::int AS total FROM contact_messages`,
      sql`SELECT count(*)::int AS total FROM projects`,
      sql`SELECT count(*)::int AS total FROM hero_images`,
    ]) as Record<string, number>[][];
    return {
      newLeads: l.new, totalLeads: l.total,
      newMessages: m.new, totalMessages: m.total,
      projects: p.total, heroPhotos: h.total,
    };
  } catch (err) {
    console.error('Failed to load admin counts:', err);
    return EMPTY_COUNTS;
  }
}

export async function updateLeadStatus(id: number, status: LeadStatus): Promise<void> {
  await getSql()`UPDATE quote_leads SET status = ${status} WHERE id = ${id}`;
}
export async function deleteQuoteLead(id: number): Promise<void> {
  await getSql()`DELETE FROM quote_leads WHERE id = ${id}`;
}
export async function updateMessageStatus(id: number, status: MessageStatus): Promise<void> {
  await getSql()`UPDATE contact_messages SET status = ${status} WHERE id = ${id}`;
}
export async function deleteContactMessage(id: number): Promise<void> {
  await getSql()`DELETE FROM contact_messages WHERE id = ${id}`;
}
