"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Inbox, MessageSquare, Images, ExternalLink, LogOut } from "lucide-react";

export default function AdminNav({ newLeads, newMessages }: { newLeads: number; newMessages: number }) {
  const pathname = usePathname();
  const router = useRouter();

  // No navigation on the login screen
  if (pathname.startsWith("/admin/login")) return null;

  const links = [
    { href: "/admin/dashboard", label: "Overview",    Icon: LayoutDashboard, badge: 0,           active: pathname.startsWith("/admin/dashboard") || pathname.startsWith("/admin/projects") },
    { href: "/admin/leads",     label: "Quote Leads", Icon: Inbox,           badge: newLeads,     active: pathname.startsWith("/admin/leads") },
    { href: "/admin/messages",  label: "Messages",    Icon: MessageSquare,   badge: newMessages,  active: pathname.startsWith("/admin/messages") },
    { href: "/admin/hero",      label: "Hero Photos", Icon: Images,          badge: 0,           active: pathname.startsWith("/admin/hero") },
  ];

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-cream-200">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 flex items-center justify-between gap-4 h-14 md:h-16">
        <Link href="/admin/dashboard" className="flex items-center gap-3 shrink-0">
          <Image src="/logo.png" alt="Site logo" width={1144} height={675} className="h-9 md:h-11 w-auto object-contain" />
          <span className="hidden sm:inline text-[11px] font-semibold tracking-[0.18em] uppercase text-ink-500 border-l border-cream-300 pl-3">
            Admin
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 flex-1 pl-6">
          {links.map(({ href, label, Icon, badge, active }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 py-5 text-[13px] font-medium border-b-2 transition-colors ${
                active ? "text-violet-600 border-violet-600" : "text-ink-700 border-transparent hover:text-violet-600"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              {label}
              {badge > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <Link href="/" target="_blank" className="hidden sm:flex items-center gap-1.5 text-xs text-ink-500 hover:text-violet-600 transition-colors">
            View site <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile tabs */}
      <nav className="md:hidden flex overflow-x-auto gap-5 px-4 border-t border-cream-200" style={{ scrollbarWidth: "none" }}>
        {links.map(({ href, label, Icon, badge, active }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 py-3 text-xs font-medium whitespace-nowrap border-b-2 ${
              active ? "text-violet-600 border-violet-600" : "text-ink-700 border-transparent"
            }`}
          >
            <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
            {label}
            {badge > 0 && (
              <span className="min-w-[16px] h-4 px-1 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center">
                {badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </header>
  );
}
