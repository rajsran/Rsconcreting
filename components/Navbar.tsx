"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">

      {/* ── Mobile bar: 3-column grid so logo is truly centred ── */}
      <div className="md:hidden grid grid-cols-3 items-center px-3 py-2">
        {/* Left: hamburger */}
        <div className="flex justify-start items-center">
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="flex items-center">
            {open
              ? <X className="w-6 h-6 text-ink-900" />
              : <Image src="/burgermenu.png" alt="Menu" width={30} height={30} className="h-7 w-7 object-contain" />}
          </button>
        </div>

        {/* Centre: logo */}
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="RS Concrete Creations & Landscaping"
              width={1144}
              height={675}
              className="h-[48px] w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Right: call */}
        <div className="flex justify-end items-center">
          <a href="tel:0476863201" className="flex items-center">
            <Image src="/callus.png" alt="Call Us" width={28} height={28} className="h-7 w-auto object-contain" />
          </a>
        </div>
      </div>

      {/* ── Desktop bar ── */}
      <div className="hidden md:flex max-w-[1800px] mx-auto h-[54px] px-10 items-center justify-between">
        <Link href="/" className="flex items-center shrink-0 absolute left-0 top-0 z-10 bg-white rounded-br-2xl shadow-md px-4 pt-1.5 pb-2">
          <Image
            src="/logo.png"
            alt="RS Concrete Creations & Landscaping"
            width={1144}
            height={675}
            className="h-[64px] w-auto object-contain"
            priority
          />
        </Link>

        <div className="flex flex-1 items-center gap-7 pl-[190px] lg:pl-[210px]">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[13px] font-medium py-1 border-b-2 transition-colors duration-200 ${
                pathname === l.href
                  ? "text-violet-600 border-violet-600"
                  : "text-ink-700 border-transparent hover:text-violet-600"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-violet-600 text-white text-xs font-semibold tracking-wider uppercase hover:bg-violet-700 transition-all duration-200"
          >
            <Phone className="w-3.5 h-3.5" />
            Get a Free Quote
          </Link>
        </div>
      </div>

      {/* ── Mobile slide-down menu ── */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-6 py-5 flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`text-sm font-medium py-1 transition-colors ${
                  pathname === l.href ? "text-violet-600" : "text-ink-700"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 px-5 py-3 rounded-md bg-violet-600 text-white text-sm font-semibold tracking-wider uppercase text-center"
            >
              Get a Free Quote
            </Link>
            <div className="flex items-center gap-4 pt-1">
              <a href="https://www.instagram.com/rsconcreting/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="opacity-90 hover:opacity-100 transition-opacity">
                <Image src="/instagram.png" alt="Instagram" width={22} height={22} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61550892891589" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="opacity-90 hover:opacity-100 transition-opacity">
                <Image src="/fb.png" alt="Facebook" width={22} height={22} />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
