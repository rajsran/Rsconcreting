"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, Trash2, Inbox, Clock, Ruler, MapPin, Plus, X, Send, Loader2, CheckCircle2 } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { LEAD_STATUSES, type QuoteLeadRecord, type LeadStatus, type LineItem } from "@/lib/leadTypes";

const FILTERS = ["all", ...LEAD_STATUSES] as const;
type Filter = (typeof FILTERS)[number];

const present = (v: string | null | undefined) => (v && v !== "Not provided" ? v : null);

const EMPTY_ITEM = (): LineItem => ({ description: "", amount: 0 });

export default function LeadsClient({ initial }: { initial: QuoteLeadRecord[] }) {
  const [leads, setLeads] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [quotePanelId, setQuotePanelId] = useState<number | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([EMPTY_ITEM()]);
  const [sending, setSending] = useState(false);
  const [sentId, setSentId] = useState<number | null>(null);
  const [sendError, setSendError] = useState("");
  const router = useRouter();

  const shown = filter === "all" ? leads : leads.filter((l) => l.status === filter);
  const countOf = (f: Filter) => (f === "all" ? leads.length : leads.filter((l) => l.status === f).length);

  async function setStatus(id: number, status: LeadStatus) {
    const previous = leads;
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) setLeads(previous);
    else router.refresh();
  }

  async function remove(id: number) {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    if (res.ok) {
      setLeads((ls) => ls.filter((l) => l.id !== id));
      if (quotePanelId === id) setQuotePanelId(null);
      router.refresh();
    }
  }

  function openQuotePanel(id: number) {
    setQuotePanelId(id);
    setLineItems([EMPTY_ITEM()]);
    setSendError("");
    setSentId(null);
  }

  function closeQuotePanel() {
    setQuotePanelId(null);
    setSendError("");
  }

  function updateItem(index: number, field: keyof LineItem, value: string | number) {
    setLineItems((items) =>
      items.map((item, i) =>
        i === index ? { ...item, [field]: field === "amount" ? Number(value) : value } : item
      )
    );
  }

  function addItem() {
    setLineItems((items) => [...items, EMPTY_ITEM()]);
  }

  function removeItem(index: number) {
    setLineItems((items) => items.filter((_, i) => i !== index));
  }

  async function sendQuote(lead: QuoteLeadRecord) {
    const valid = lineItems.filter((i) => i.description.trim() && i.amount > 0);
    if (!valid.length) { setSendError("Add at least one line item with a description and amount."); return; }
    if (!lead.email) { setSendError("This customer has no email address."); return; }

    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/admin/leads/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, lineItems: valid }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed to send");
      }
      setSentId(lead.id);
      setStatus(lead.id, "contacted");
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Failed to send quote");
    } finally {
      setSending(false);
    }
  }

  const total = lineItems.reduce((s, i) => s + (Number(i.amount) || 0), 0);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-8 md:py-10">
      <div className="mb-6">
        <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-ink-500 mb-2">Admin</p>
        <h1 className="font-bold tracking-tight text-3xl text-ink-900">
          Quote <span className="text-violet-600">Leads.</span>
        </h1>
        <p className="text-sm text-ink-500 mt-2">Everyone who used the &ldquo;Get a Free Quote&rdquo; popup.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-md text-[11px] font-semibold tracking-wider uppercase border transition-colors ${
              filter === f
                ? "bg-violet-600 border-violet-600 text-white"
                : "bg-white border-cream-300 text-ink-700 hover:border-violet-600 hover:text-violet-600"
            }`}
          >
            {f} <span className="opacity-70">({countOf(f)})</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-cream-300 rounded-sm">
          <Inbox className="w-10 h-10 mx-auto mb-3 text-ink-300" strokeWidth={1.25} />
          <p className="font-semibold text-ink-700">{leads.length === 0 ? "No leads yet" : "No leads with this status"}</p>
          <p className="text-sm text-ink-500 mt-1">
            {leads.length === 0
              ? "They'll appear here as soon as someone requests a quote."
              : "Try another filter."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {shown.map((l) => (
            <article key={l.id} className="bg-white border border-cream-200 rounded-sm shadow-sm overflow-hidden">
              {/* ── Lead details row ── */}
              <div className="p-5 grid lg:grid-cols-[1.1fr_1.4fr_auto] gap-5 items-start">
                {/* Who */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                    <h2 className="font-bold text-ink-900 truncate">{present(l.name) ?? "Unnamed lead"}</h2>
                    <StatusBadge status={l.status} />
                  </div>
                  <div className="flex flex-col gap-1.5 text-[13px]">
                    {present(l.phone) && (
                      <a href={`tel:${l.phone}`} className="inline-flex items-center gap-2 text-ink-700 hover:text-violet-600">
                        <Phone className="w-3.5 h-3.5 text-violet-600" /> {l.phone}
                      </a>
                    )}
                    {present(l.email) && (
                      <a href={`mailto:${l.email}`} className="inline-flex items-center gap-2 text-ink-700 hover:text-violet-600 break-all">
                        <Mail className="w-3.5 h-3.5 text-violet-600 shrink-0" /> {l.email}
                      </a>
                    )}
                    {present(l.postcode) && (
                      <span className="inline-flex items-center gap-2 text-ink-500">
                        <MapPin className="w-3.5 h-3.5 text-violet-600 shrink-0" /> Postcode {l.postcode}
                      </span>
                    )}
                    {!present(l.phone) && !present(l.email) && (
                      <span className="text-ink-300">No contact details given</span>
                    )}
                  </div>
                  <p className="text-[11px] text-ink-300 mt-3">
                    {new Date(l.createdAt).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>

                {/* What */}
                <div className="min-w-0 text-[13px]">
                  <p className="font-semibold text-ink-900 mb-1">
                    {l.service}
                    {l.type && l.type !== l.service
                      ? <span className="text-ink-500 font-normal"> · {l.type}</span>
                      : null}
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-ink-700 mb-3">
                    {present(l.size) && (
                      <span className="inline-flex items-center gap-1.5">
                        <Ruler className="w-3.5 h-3.5 text-ink-300" /> {l.size}
                      </span>
                    )}
                    {present(l.timeline) && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-ink-300" /> {l.timeline}
                      </span>
                    )}
                  </div>
                  {l.estimateLow != null && l.estimateHigh != null ? (
                    <p className="inline-block bg-cream-100 text-ink-900 font-bold rounded-sm px-3 py-1.5">
                      ${l.estimateLow.toLocaleString()} – ${l.estimateHigh.toLocaleString()}
                      <span className="text-ink-500 font-normal text-[11px]"> estimate</span>
                    </p>
                  ) : (
                    <p className="text-ink-300 text-[12px]">No estimate — needs on-site measure</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col items-center lg:items-end gap-3">
                  <select
                    value={l.status}
                    onChange={(e) => setStatus(l.id, e.target.value as LeadStatus)}
                    className="border border-cream-300 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-white text-ink-900 focus:outline-none focus:border-violet-600"
                    aria-label="Lead status"
                  >
                    {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>

                  {present(l.email) && (
                    <button
                      onClick={() => quotePanelId === l.id ? closeQuotePanel() : openQuotePanel(l.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border transition-colors ${
                        quotePanelId === l.id
                          ? "bg-ink-900 text-white border-ink-900"
                          : "bg-violet-600 text-white border-violet-600 hover:bg-violet-700"
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      {quotePanelId === l.id ? "Close" : "Send Quote"}
                    </button>
                  )}

                  <button
                    onClick={() => remove(l.id)}
                    aria-label="Delete lead"
                    className="text-ink-300 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ── Send Quote Panel ── */}
              {quotePanelId === l.id && (
                <div className="border-t border-cream-200 bg-gray-50 p-5">
                  {sentId === l.id ? (
                    <div className="flex flex-col items-center py-6 gap-2 text-center">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                      <p className="font-bold text-ink-900">Quote sent to {l.email}!</p>
                      <p className="text-sm text-ink-500">PDF emailed to the customer. Status updated to Contacted.</p>
                      <button
                        onClick={closeQuotePanel}
                        className="mt-2 text-xs text-ink-400 hover:text-ink-700 underline"
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-bold text-ink-900 text-sm">Send Final Quote to {l.name}</p>
                          <p className="text-xs text-ink-400">{l.email}</p>
                        </div>
                        <button onClick={closeQuotePanel} className="text-ink-300 hover:text-ink-700">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Line items */}
                      <div className="flex flex-col gap-2 mb-3">
                        <div className="hidden sm:grid grid-cols-[1fr_140px_32px] gap-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                          <span>Description</span>
                          <span>Amount ($)</span>
                          <span />
                        </div>
                        {lineItems.map((item, i) => (
                          <div key={i} className="grid grid-cols-[1fr_140px_32px] gap-2 items-center">
                            <input
                              type="text"
                              placeholder="e.g. Exposed Aggregate Driveway — 45m²"
                              value={item.description}
                              onChange={(e) => updateItem(i, "description", e.target.value)}
                              className="w-full border border-cream-300 rounded-md px-3 py-2 text-sm text-ink-900 bg-white focus:outline-none focus:border-violet-600"
                            />
                            <input
                              type="number"
                              placeholder="0"
                              min={0}
                              value={item.amount || ""}
                              onChange={(e) => updateItem(i, "amount", e.target.value)}
                              className="w-full border border-cream-300 rounded-md px-3 py-2 text-sm text-ink-900 bg-white focus:outline-none focus:border-violet-600"
                            />
                            <button
                              onClick={() => removeItem(i)}
                              disabled={lineItems.length === 1}
                              className="flex items-center justify-center w-8 h-8 rounded-md text-ink-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={addItem}
                        className="inline-flex items-center gap-1.5 text-xs text-violet-600 font-semibold hover:text-violet-800 mb-5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add line item
                      </button>

                      {/* Total bar */}
                      <div className="flex items-center justify-between bg-ink-900 text-white rounded-md px-4 py-3 mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider">Total</span>
                        <span className="font-black text-lg">${total.toLocaleString()}</span>
                      </div>

                      {sendError && (
                        <p className="text-red-500 text-xs mb-3">{sendError}</p>
                      )}

                      <button
                        onClick={() => sendQuote(l)}
                        disabled={sending}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-md disabled:opacity-50 transition-colors"
                      >
                        {sending
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Send className="w-4 h-4" />}
                        {sending ? "Sending…" : "Send Quote Email + PDF"}
                      </button>
                    </>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
