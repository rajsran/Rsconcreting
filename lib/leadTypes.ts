// Plain types and constants shared by the server code and the admin screens.
// Keep this file free of server-only imports (database etc.) so it is safe in the browser.

export const LEAD_STATUSES = ['new', 'contacted', 'won', 'lost'] as const;
export const MESSAGE_STATUSES = ['new', 'replied'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

export interface LineItem {
  description: string;
  amount: number;
}

export interface QuoteLeadRecord {
  id: number;
  createdAt: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  postcode: string | null;
  service: string;
  type: string | null;
  size: string | null;
  timeline: string | null;
  estimateLow: number | null;
  estimateHigh: number | null;
  status: LeadStatus;
}

export interface ContactMessageRecord {
  id: number;
  createdAt: string;
  name: string;
  phone: string | null;
  email: string | null;
  service: string | null;
  message: string;
  status: MessageStatus;
}
