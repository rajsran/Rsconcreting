"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, Trash2, Inbox, Clock, Ruler } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { LEAD_STATUSES, type QuoteLeadRecord, type LeadStatus } from "@/lib/leadTypes";

const FILTERS = ["all", ...LEAD_STATUSES] as const;
type Filter = (typeof FILTERS)[number];

const present = (v: string | null) => (v && v !== "Not provided" ? v : null);

export default function LeadsClient({ initial }: { initial: QuoteLeadRecord[] }) {
  const [leads, setLeads] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");
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
    else router.refresh(); // updates the "new" badge in the nav
  }

  async function remove(id: number) {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    if (res.ok) {
      setLeads((ls) => ls.filter((l) => l.id !== id));
      router.refresh();
    }
  }

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
            {leads.length === 0 ? "They'll appear here as soon as someone requests a quote." : "Try another filter."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {shown.map((l) => (
            <article key={l.id} className="bg-white border border-cream-200 rounded-sm shadow-sm p-5 grid lg:grid-cols-[1.1fr_1.4fr_auto] gap-5 items-start">
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
                  {!present(l.phone) && !present(l.email) && <span className="text-ink-300">No contact details given</span>}
                </div>
                <p className="text-[11px] text-ink-300 mt-3">
                  {new Date(l.createdAt).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>

              {/* What */}
              <div className="min-w-0 text-[13px]">
                <p className="font-semibold text-ink-900 mb-1">
                  {l.service}
                  {l.type && l.type !== l.service ? <span className="text-ink-500 font-normal"> · {l.type}</span> : null}
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-ink-700 mb-3">
                  {present(l.size) && (
                    <span className="inline-flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5 text-ink-300" /> {l.size}</span>
                  )}
                  {present(l.timeline) && (
                    <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-ink-300" /> {l.timeline}</span>
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
                <button onClick={() => remove(l.id)} aria-label="Delete lead" className="text-ink-300 hover:text-red-500 transition-colors p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
