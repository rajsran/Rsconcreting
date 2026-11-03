"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight, Phone, Star, Gem, ShieldCheck, Home, Layers, MapPin,
  HardHat,
} from "lucide-react";
import QuoteChat from "@/components/QuoteChat";
import { ImageSlot, Eyebrow, Heading } from "@/components/SiteUI";

/* ──────────────────────────────────────────────────────────────
   IMAGE SLOTS
   Every `src` below is empty. Drop your photo into /public (e.g.
   /public/images/driveways.jpg) and set src: "/images/driveways.jpg".
   Until then a placeholder box is shown in the same space.
   ────────────────────────────────────────────────────────────── */

const HERO_IMAGE = "/images/hero.png"; // e.g. "/images/hero.jpg" — large house/exterior photo (landscape, ~1600x900)
const ABOUT_IMAGE = "/images/about.png"; // e.g. "/images/about.jpg" — house/street photo (~4:3)
const CTA_IMAGE = "/images/cta.png";  // e.g. "/images/cta.jpg" — dark, moody background for the bottom banner

const categories = [
  { title: "Driveways",       href: "/services", src: "/images/driveways.png" },
  { title: "Landscaping",     href: "/services", src: "/images/landscaping.png" },
  { title: "Retaining Walls", href: "/services", src: "/images/retaining-walls.png" },
  { title: "Concrete Steps",  href: "/services", src: "/images/concrete-steps.png" },
  { title: "Fencing & Gates", href: "/services", src: "/images/fencing-gates.png" },
  { title: "Excavation",      href: "/services", src: "/images/excavation.png" },
];

const recentProjects = [
  { title: "Project 1", src: "/images/project-1.jpg" },
  { title: "Project 2", src: "/images/project-2.jpg" },
  { title: "Project 3", src: "/images/project-3.jpg" },
  { title: "Project 4", src: "/images/project-4.jpg" },
];

const reviews = [
  { name: "Jo",     place: "Manor Lakes, VIC", text: "Absolutely stoked with the work Ranjodh and the team did on our front yard. Quality, communication and finish were all spot on." },
  { name: "Kate",   place: "Werribee, VIC",    text: "Highly recommend RS Concrete Creations & Landscaping, Professional, on time and the end result looks amazing." },
  { name: "Niketa", place: "Melbourne, VIC",   text: "From start to finish the whole process was smooth. The driveway and landscaping turned out better than we expected." },
];

const trust = [
  { Icon: Gem,         label: "Premium\nWorkmanship" },
  { Icon: ShieldCheck, label: "Reliable\n& On Time" },
  { Icon: Home,        label: "Local\nMelbourne Business" },
];

const aboutPoints = [
  { Icon: HardHat,     label: "Experienced\n& Qualified" },
  { Icon: Layers,      label: "Quality Materials\n& Finishes" },
  { Icon: ShieldCheck, label: "Fully Insured" },
  { Icon: MapPin,      label: "Servicing\nMelbourne & Surrounds" },
];

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [heroImage, setHeroImage] = useState(HERO_IMAGE);

  // If an admin has uploaded hero photos, the first one replaces the built-in image
  useEffect(() => {
    fetch("/api/hero")
      .then((r) => r.json())
      .then(({ urls }: { urls: string[] }) => {
        if (urls?.length > 0) setHeroImage(urls[0]);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative bg-white pt-[64px] md:pt-[54px] overflow-hidden">
        {/* Image: stacked on mobile, right-hand backdrop on desktop */}
        <ImageSlot
          src={heroImage}
          alt="Luxury outdoor transformation"
          label="Hero image — 1600×900"
          sizes="100vw"
          priority
          imgClassName="object-[center_65%]"
          className="h-64 w-full md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[68%]"
        />
        <div className="hidden md:block absolute inset-y-0 right-0 w-[68%] bg-gradient-to-r from-white via-white/60 to-transparent pointer-events-none" />

        <div className="relative max-w-[1800px] mx-auto px-6 md:px-10 py-10 md:py-16 md:min-h-[406px] md:flex md:items-center">
          <div className="md:max-w-[46%] md:pl-4">
            <Eyebrow className="mb-6">Melbourne&apos;s Trusted Concrete &amp; Landscaping Specialists</Eyebrow>
            <h1 className="font-bold tracking-tight text-[2.6rem] md:text-[3.4rem] leading-[1.05] text-ink-900 mb-6">
              Luxury Outdoor
              <br />
              <span className="text-violet-600">Transformations.</span>
            </h1>
            <p className="text-ink-700 text-[15px] leading-relaxed mb-8 max-w-sm">
              Custom concreting, landscaping and outdoor construction for modern homes across Melbourne.
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-4 mb-9">
              {trust.map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon className="w-7 h-7 text-violet-600 shrink-0" strokeWidth={1.25} />
                  <span className="text-xs text-ink-700 leading-snug whitespace-pre-line">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsChatOpen(true)}
                className="inline-flex items-center gap-2.5 px-7 py-4 bg-violet-600 text-white text-xs font-semibold tracking-wider uppercase rounded-md hover:bg-violet-700 transition-colors"
              >
                Get a Free Quote <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/projects"
                className="inline-flex items-center px-7 py-4 border border-ink-900 bg-white text-ink-900 text-xs font-semibold tracking-wider uppercase rounded-md hover:bg-ink-900 hover:text-white transition-colors"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service categories ───────────────────────────── */}
      <section className="bg-cream-100 py-4">
        <div className="max-w-[1800px] mx-auto px-4 md:px-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-card transition-shadow"
            >
              <ImageSlot
                src={c.src}
                alt={c.title}
                label={c.title}
                sizes="(max-width: 1024px) 50vw, 16vw"
                className="aspect-[4/3] w-full"
              />
              <div className="flex items-center justify-between px-3.5 py-3 text-[13px] font-medium text-ink-900">
                {c.title}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── About ────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <ImageSlot
            src={ABOUT_IMAGE}
            alt="Completed home exterior"
            label="About image — 4:3"
            className="aspect-[4/3] w-full rounded-sm"
          />
          <div className="min-w-0">
            <Eyebrow className="mb-4">About RS Concrete Creations &amp; Landscaping</Eyebrow>
            <Heading plain="More Than Concreting." gold="Complete Outdoor Solutions." className="text-3xl md:text-[2.1rem] mb-5" />
            <p className="text-ink-700 text-sm leading-relaxed mb-8">
              We specialise in high-quality concreting, landscaping and outdoor construction for residential and
              commercial projects across Melbourne. From exposed aggregate driveways and concrete steps to full front
              and backyard transformations, we bring your vision to life with premium finishes and attention to detail.
            </p>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              {aboutPoints.map(({ Icon, label }) => (
                <div key={label} className="bg-cream-50 rounded-sm px-3 py-5 flex flex-col gap-4">
                  <Icon className="w-7 h-7 text-violet-600" strokeWidth={1.25} />
                  <span className="text-xs text-ink-900 leading-snug whitespace-pre-line">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Recent projects ──────────────────────────────── */}
      <section className="bg-white pb-14 md:pb-20">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <Eyebrow className="mb-2">Featured Projects</Eyebrow>
              <h2 className="font-bold tracking-tight text-3xl md:text-[2.1rem] text-ink-900">
                Recent <span className="text-violet-600">Transformations.</span>
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-3 border border-ink-900 text-[11px] font-semibold tracking-wider uppercase rounded-md hover:bg-ink-900 hover:text-white transition-colors"
            >
              View All Projects <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {recentProjects.map((p) => (
              <ImageSlot
                key={p.title}
                src={p.src}
                alt={p.title}
                label={p.title}
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="aspect-[4/3] w-full rounded-sm"
              />
            ))}
          </div>
          <Link
            href="/projects"
            className="sm:hidden mt-5 inline-flex items-center gap-2 px-5 py-3 border border-ink-900 text-[11px] font-semibold tracking-wider uppercase rounded-md"
          >
            View All Projects <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────── */}
      <section id="reviews" className="bg-cream-50 py-10 md:py-12">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-10 items-start">
          <div>
            <Eyebrow className="mb-3">What Our Clients Say</Eyebrow>
            <h2 className="font-bold tracking-tight leading-[1.15] text-ink-900 text-[1.7rem] md:text-3xl mb-7">
              Trusted by Homeowners
              <br />
              Across <span className="text-violet-600">Melbourne.</span>
            </h2>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 border border-ink-900 text-[11px] font-semibold tracking-wider uppercase rounded-md hover:bg-ink-900 hover:text-white transition-colors"
            >
              View More Reviews <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {reviews.map((r) => (
              <figure key={r.name} className="bg-white rounded-sm px-5 pt-4 pb-5 flex flex-col shadow-sm min-h-[200px]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-bold text-[#4285F4] text-lg leading-none">G</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-violet-600 fill-violet-600" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-[13px] text-ink-700 leading-relaxed flex-1 mb-6">
                  &ldquo;{r.text}&rdquo;
                </blockquote>
                <figcaption>
                  <p className="text-xs font-bold text-ink-900">{r.name}</p>
                  <p className="text-[11px] text-ink-300">{r.place}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────── */}
      <section className="relative bg-ink-900 overflow-hidden">
        <div className="absolute inset-0">
          <ImageSlot
            src={CTA_IMAGE}
            alt=""
            label="CTA background — dark, wide"
            sizes="100vw"
            imgClassName="object-[center_70%]"
            className="h-full w-full !bg-ink-900"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none" />
        <div className="relative max-w-[1800px] mx-auto px-6 md:px-10 py-12 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <Eyebrow className="!text-white/80 mb-3">Ready to transform your outdoor space?</Eyebrow>
            <h2 className="font-bold tracking-tight text-3xl md:text-4xl text-white mb-2">Get a Free Quote Today.</h2>
            <p className="text-white/90 text-sm">Let&apos;s discuss your project and bring your vision to life.</p>
          </div>
          <button
            onClick={() => setIsChatOpen(true)}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-violet-600 text-white text-xs font-semibold tracking-wider uppercase rounded-md hover:bg-violet-700 transition-colors self-start md:self-auto"
          >
            <Phone className="w-4 h-4" /> Get a Free Quote <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <QuoteChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
