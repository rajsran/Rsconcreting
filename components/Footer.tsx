import Link from "next/link";
import { Phone, MapPin, Clock, Shovel, Instagram } from "lucide-react";

const quickLinks = [
  { href: "/",         label: "Home"       },
  { href: "/services", label: "Services"   },
  { href: "/projects", label: "Projects"   },
  { href: "/about",    label: "About Us"   },
  { href: "/contact",  label: "Contact"    },
];

const contactItems = [
  { Icon: MapPin,    content: "19 Zoe Street, Rockbank VIC",   href: "https://maps.google.com/?q=19+Zoe+Street+Rockbank+VIC" },
  { Icon: Phone,     content: "0476 863 201",                  href: "tel:0476863201"  },
  { Icon: Clock,     content: "Mon–Fri, 8am – 4pm",           href: null              },
  { Icon: Instagram, content: "@rsconcreting",                 href: "https://www.instagram.com/rsconcreting/" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-white">
      <div className="max-w-[1800px] mx-auto px-5 pt-10 pb-6">

        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
            <Shovel className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <span className="block text-white font-black text-sm tracking-widest uppercase">Groundmakers</span>
            <span className="block text-violet-500 text-[10px] tracking-widest uppercase">Concrete &amp; Landscaping</span>
          </div>
        </div>

        {/* Two-col grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">

          {/* Quick Links */}
          <div>
            <p className="text-violet-500 text-[10px] font-bold tracking-widest uppercase mb-3">Quick Links</p>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-violet-500 text-[10px] font-bold tracking-widest uppercase mb-3">Contact</p>
            <ul className="flex flex-col gap-2.5">
              {contactItems.map(({ Icon, content, href }) => (
                <li key={content} className="flex items-start gap-2">
                  <Icon className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
                  {href ? (
                    <a href={href} className="text-white/60 text-sm hover:text-white transition-colors leading-tight">{content}</a>
                  ) : (
                    <span className="text-white/60 text-sm leading-tight">{content}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <a
          href="tel:0476863201"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-bold rounded-2xl text-sm transition-all mb-6"
        >
          <Phone className="w-4 h-4" />
          Call Us Now
        </a>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-5 py-4">
        <p className="text-white/20 text-xs text-center">
          © {new Date().getFullYear()} Groundmakers Concrete &amp; Landscaping. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
