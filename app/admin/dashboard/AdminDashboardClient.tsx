"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/projects";
import type { AdminCounts } from "@/lib/leads";
import type { QuoteLeadRecord, ContactMessageRecord } from "@/lib/leadTypes";
import StatusBadge from "@/components/admin/StatusBadge";
import { Plus, Trash2, FolderOpen, Pencil, Images, Inbox, MessageSquare, ArrowRight } from "lucide-react";

function blobSrc(url: string) {
  return url.includes('.private.blob.vercel-storage.com')
    ? `/api/image?url=${encodeURIComponent(url)}`
    : url;
}

interface Props {
  projects: Project[];
  counts: AdminCounts;
  recentLeads: QuoteLeadRecord[];
  recentMessages: ContactMessageRecord[];
}

export default function AdminDashboardClient({ projects: initial, counts, recentLeads, recentMessages }: Props) {
  const [projects, setProjects] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeleting(id);
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setProjects(p => p.filter(x => x.id !== id));
    setDeleting(null);
    router.refresh();
  }

  const stats = [
    { label: "New quote leads", value: counts.newLeads,     sub: `${counts.totalLeads} total`,      href: "/admin/leads",    Icon: Inbox },
    { label: "New messages",    value: counts.newMessages,  sub: `${counts.totalMessages} total`,   href: "/admin/messages", Icon: MessageSquare },
    { label: "Projects",        value: projects.length,     sub: "shown on the Projects page",      href: "#projects",       Icon: FolderOpen },
    { label: "Hero photos",     value: counts.heroPhotos,   sub: "first one is the home hero",      href: "/admin/hero",     Icon: Images },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-8 md:py-10">

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-ink-500 mb-2">Admin</p>
          <h1 className="font-bold tracking-tight text-3xl md:text-4xl text-ink-900">
            Dashboard <span className="text-violet-600">Overview.</span>
          </h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-violet-600 text-white text-xs font-semibold tracking-wider uppercase rounded-md hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
        {stats.map(({ label, value, sub, href, Icon }) => (
          <Link
            key={label}
            href={href}
            className="bg-white border border-cream-200 rounded-sm p-5 shadow-sm hover:shadow-card transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <Icon className="w-6 h-6 text-violet-600" strokeWidth={1.25} />
              <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="font-bold text-3xl md:text-4xl text-ink-900 tracking-tight">{value}</p>
            <p className="text-[13px] font-medium text-ink-900 mt-1">{label}</p>
            <p className="text-[11px] text-ink-300 mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-4 md:gap-6 mb-12">
        <section className="bg-white border border-cream-200 rounded-sm shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200">
            <h2 className="font-bold text-ink-900 text-sm">Latest quote leads</h2>
            <Link href="/admin/leads" className="text-[11px] font-semibold tracking-wider uppercase text-violet-600 hover:text-violet-700">View all</Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-ink-300">No quote leads yet.</p>
          ) : (
            <ul className="divide-y divide-cream-200">
              {recentLeads.map((l) => (
                <li key={l.id}>
                  <Link href="/admin/leads" className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-cream-50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-900 truncate">
                        {l.name && l.name !== "Not provided" ? l.name : "Unnamed lead"}
                      </p>
                      <p className="text-xs text-ink-500 truncate">
                        {l.type && l.type !== l.service ? `${l.type}` : l.service}
                        {l.estimateLow != null && l.estimateHigh != null
                          ? ` · $${l.estimateLow.toLocaleString()}–$${l.estimateHigh.toLocaleString()}`
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] text-ink-300 hidden sm:inline">
                        {new Date(l.createdAt).toLocaleDateString("en-AU")}
                      </span>
                      <StatusBadge status={l.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white border border-cream-200 rounded-sm shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200">
            <h2 className="font-bold text-ink-900 text-sm">Latest messages</h2>
            <Link href="/admin/messages" className="text-[11px] font-semibold tracking-wider uppercase text-violet-600 hover:text-violet-700">View all</Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-ink-300">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-cream-200">
              {recentMessages.map((m) => (
                <li key={m.id}>
                  <Link href="/admin/messages" className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-cream-50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-900 truncate">{m.name}</p>
                      <p className="text-xs text-ink-500 truncate">{m.message}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] text-ink-300 hidden sm:inline">
                        {new Date(m.createdAt).toLocaleDateString("en-AU")}
                      </span>
                      <StatusBadge status={m.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Projects */}
      <section id="projects" className="scroll-mt-24">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-ink-500 mb-1">Portfolio</p>
            <h2 className="font-bold tracking-tight text-2xl text-ink-900">
              Your <span className="text-violet-600">Projects.</span>
            </h2>
          </div>
          <span className="text-xs text-ink-500 bg-white border border-cream-200 px-3 py-1.5 rounded-full">
            {projects.length} total
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-cream-300 rounded-sm">
            <FolderOpen className="w-10 h-10 mx-auto mb-3 text-ink-300" strokeWidth={1.25} />
            <p className="font-semibold text-ink-700">No projects yet</p>
            <p className="text-sm text-ink-500 mt-1 mb-6">Add your first project to show customers your work.</p>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-violet-600 text-white text-xs font-semibold tracking-wider uppercase rounded-md hover:bg-violet-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add First Project
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map(p => (
              <div key={p.id} className="bg-white rounded-sm overflow-hidden border border-cream-200 shadow-sm flex flex-col">
                <div className="relative aspect-[4/3] bg-cream-200">
                  {p.imageUrls[0] ? (
                    <Image
                      src={blobSrc(p.imageUrls[0])}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                      unoptimized={blobSrc(p.imageUrls[0]).startsWith('/api/image')}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-ink-300">
                      <FolderOpen className="w-8 h-8" strokeWidth={1.25} />
                    </div>
                  )}
                  {p.imageUrls.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full leading-none">
                      {p.imageUrls.length} photos
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-ink-900 truncate text-sm">{p.title}</h3>
                  {p.description && <p className="text-xs text-ink-500 line-clamp-2 mt-1">{p.description}</p>}
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <span className="text-[11px] text-ink-300">{new Date(p.createdAt).toLocaleDateString("en-AU")}</span>
                    <div className="flex items-center gap-4">
                      <Link href={`/admin/projects/${p.id}/edit`} aria-label="Edit project" className="text-ink-300 hover:text-violet-600 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                        aria-label="Delete project"
                        className="text-ink-300 hover:text-red-500 disabled:opacity-30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
