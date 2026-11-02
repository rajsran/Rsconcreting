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

  // Admin area has its own screens — don't show the public site navbar there
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-[1800px] mx-auto pl-3 pr-3 py-2.5 md:py-0 md:h-[70px] md:px-10 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 md:absolute md:left-0 md:top-0 md:z-10 md:bg-white md:rounded-br-3xl md:shadow-md md:px-6 md:pt-2 md:pb-3">
          <Image
            src="/logo.png"
            alt="RS Concrete Creations & Landscaping"
            width={1144}
            height={675}
            className="h-[60px] md:h-[88px] w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex flex-1 items-center gap-9 md:pl-[240px] lg:pl-[270px]">
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
            className="ml-auto inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-violet-600 text-white text-xs font-semibold tracking-wider uppercase hover:bg-violet-700 transition-all duration-200"
          >
            <Phone className="w-3.5 h-3.5" />
            Get a Free Quote
          </Link>
        </div>

        {/* Mobile: labeled pill buttons + social icons + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <a
            href="https://www.instagram.com/groundmakers?utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex items-center opacity-90 hover:opacity-100 transition-opacity duration-200"
          >
            <Image src="/instagram.png" alt="Instagram" width={32} height={32} className="h-8 w-8 object-contain" />
          </a>
          <a
            href="https://www.facebook.com/share/18jjsoJ2zR/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex items-center opacity-90 hover:opacity-100 transition-opacity duration-200"
          >
            <Image src="/fb.png" alt="Facebook" width={32} height={32} className="h-8 w-8 object-contain" />
          </a>
          <a href="tel:0433457437" className="flex items-center">
            <Image src="/callus.png" alt="Call Us" width={32} height={32} className="h-8 w-auto object-contain" />
          </a>
          <button
            className="ml-1 flex items-center"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Image src="/burgermenu.png" alt="Menu" width={32} height={32} className="h-8 w-8 object-contain" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
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
              <a
                href="https://www.instagram.com/groundmakers?utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="opacity-90 hover:opacity-100 transition-opacity duration-200"
              >
                <Image src="/instagram.png" alt="Instagram" width={22} height={22} />
              </a>
              <a
                href="https://www.facebook.com/share/18jjsoJ2zR/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="opacity-90 hover:opacity-100 transition-opacity duration-200"
              >
                <Image src="/fb.png" alt="Facebook" width={22} height={22} />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
