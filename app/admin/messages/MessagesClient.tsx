"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, Trash2, MessageSquare, Check } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import type { ContactMessageRecord, MessageStatus } from "@/lib/leadTypes";

type Filter = "all" | MessageStatus;
const FILTERS: Filter[] = ["all", "new", "replied"];

export default function MessagesClient({ initial }: { initial: ContactMessageRecord[] }) {
  const [messages, setMessages] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const router = useRouter();

  const shown = filter === "all" ? messages : messages.filter((m) => m.status === filter);
  const countOf = (f: Filter) => (f === "all" ? messages.length : messages.filter((m) => m.status === f).length);

  async function setStatus(id: number, status: MessageStatus) {
    const previous = messages;
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, status } : m)));
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) setMessages(previous);
    else router.refresh(); // updates the "new" badge in the nav
  }

  async function remove(id: number) {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessages((ms) => ms.filter((m) => m.id !== id));
      router.refresh();
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-8 md:py-10">
      <div className="mb-6">
        <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-ink-500 mb-2">Admin</p>
        <h1 className="font-bold tracking-tight text-3xl text-ink-900">
          Contact <span className="text-violet-600">Messages.</span>
        </h1>
        <p className="text-sm text-ink-500 mt-2">Messages sent from the Contact page form.</p>
      </div>

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
          <MessageSquare className="w-10 h-10 mx-auto mb-3 text-ink-300" strokeWidth={1.25} />
          <p className="font-semibold text-ink-700">{messages.length === 0 ? "No messages yet" : "No messages with this status"}</p>
          <p className="text-sm text-ink-500 mt-1">
            {messages.length === 0 ? "They'll appear here when someone uses the Contact form." : "Try another filter."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {shown.map((m) => (
            <article key={m.id} className="bg-white border border-cream-200 rounded-sm shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                    <h2 className="font-bold text-ink-900">{m.name}</h2>
                    <StatusBadge status={m.status} />
                    {m.service && <span className="text-[11px] text-ink-500 bg-cream-100 px-2.5 py-1 rounded-full">{m.service}</span>}
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
                    {m.phone && (
                      <a href={`tel:${m.phone}`} className="inline-flex items-center gap-2 text-ink-700 hover:text-violet-600">
                        <Phone className="w-3.5 h-3.5 text-violet-600" /> {m.phone}
                      </a>
                    )}
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="inline-flex items-center gap-2 text-ink-700 hover:text-violet-600 break-all">
                        <Mail className="w-3.5 h-3.5 text-violet-600 shrink-0" /> {m.email}
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-ink-300 shrink-0">
                  {new Date(m.createdAt).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>

              <p className="text-[13px] text-ink-700 leading-relaxed whitespace-pre-wrap bg-cream-50 rounded-sm px-4 py-3 mb-4">{m.message}</p>

              <div className="flex items-center justify-between">
                {m.status === "new" ? (
                  <button
                    onClick={() => setStatus(m.id, "replied")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-[11px] font-semibold tracking-wider uppercase rounded-md hover:bg-violet-700 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark as replied
                  </button>
                ) : (
                  <button
                    onClick={() => setStatus(m.id, "new")}
                    className="text-[11px] font-semibold tracking-wider uppercase text-ink-500 hover:text-violet-600 transition-colors"
                  >
                    Mark as new
                  </button>
                )}
                <button onClick={() => remove(m.id)} aria-label="Delete message" className="text-ink-300 hover:text-red-500 transition-colors p-1">
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
