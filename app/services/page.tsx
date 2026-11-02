"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Check, Hammer, Leaf, Layers, ShieldCheck, Mountain, ArrowRight } from "lucide-react";
import { ImageSlot, Eyebrow } from "@/components/SiteUI";
import { PRICING } from "@/lib/pricing";

/* Image slots: set `image` to a file in /public (e.g. "/images/decking.jpg"). Empty = placeholder. */

/** "$60 – $110 / m²" plus a "cheapest from · priciest from" note, read from lib/pricing.ts */
function priceGuide(service: string) {
  const types = Object.entries(PRICING[service] ?? {});
  if (!types.length) return null;
  const lows = types.map(([, p]) => p.low);
  const highs = types.map(([, p]) => p.high);
  const unit = types[0][1].unit;
  const sorted = [...types].sort((a, b) => a[1].low - b[1].low);
  const cheapest = sorted[0];
  const priciest = sorted[sorted.length - 1];
  return {
    pricing: `$${Math.min(...lows)} – $${Math.max(...highs)} / ${unit}`,
    pricingNote:
      sorted.length > 1
        ? `${cheapest[0]} from $${cheapest[1].low} · ${priciest[0]} from $${priciest[1].low}`
        : `${cheapest[0]} from $${cheapest[1].low}`,
  };
}

const services = [
  {
    id: "concreting",
    Icon: Hammer,
    title: "Concreting",
    tagline: "Built to last Melbourne's toughest conditions.",
    desc: "From driveways to pool surrounds, our concrete work is engineered to endure. We specialise in exposed aggregate, coloured concrete, plain slabs, pathways and more — finished to a premium standard every time.",
    features: [
      "Driveways & crossovers",
      "Concrete slabs & footings",
      "Exposed aggregate finish",
      "Coloured & stamped concrete",
      "Pathways & pool surrounds",
      "Kerb & channel work",
    ],
    ...priceGuide("Concreting")!,
    image: "/images/driveways.png",
  },
  {
    id: "landscaping",
    Icon: Leaf,
    title: "Landscaping",
    tagline: "Outdoor spaces you'll actually use.",
    desc: "We design and build complete garden landscapes — from soil prep and planting through to irrigation, feature walls and lighting. Whether you have a blank canvas or need a tired yard transformed, we handle it all.",
    features: [
      "Full garden design & installation",
      "Turf supply & laying",
      "Garden beds & planting",
      "Irrigation & drainage systems",
      "Feature walls & edging",
      "Outdoor lighting",
    ],
    ...priceGuide("Landscaping")!,
    image: "/images/landscaping.png",
  },
  {
    id: "decking",
    Icon: Layers,
    title: "Decking",
    tagline: "Extend your living area outdoors.",
    desc: "A custom-built deck adds real value and usability to your home. We work with hardwood timber, treated pine and composite materials — designing and constructing decks that look great and stand the test of time.",
    features: [
      "Hardwood & treated pine decks",
      "Composite (low-maintenance) decking",
      "Pergolas & shade structures",
      "Steps, balustrades & handrails",
      "Staining, oiling & sealing",
      "Council permit assistance",
    ],
    ...priceGuide("Decking")!,
    image: "", // e.g. "/images/decking.jpg"
  },
  {
    id: "fencing",
    Icon: ShieldCheck,
    title: "Fencing",
    tagline: "Privacy, security and clean boundaries.",
    desc: "We install all types of residential and commercial fencing — from sleek Colorbond panels to timber paling and aluminium slats. Every fence is set with proper footings and finished with quality hardware.",
    features: [
      "Colorbond steel fencing",
      "Timber paling fences",
      "Aluminium slat fencing",
      "Pool fencing (compliant)",
      "Gates & automated openers",
      "Retaining & boundary fences",
    ],
    ...priceGuide("Fencing")!,
    image: "/images/fencing-gates.png",
  },
  {
    id: "retaining-walls",
    Icon: Mountain,
    title: "Retaining Walls",
    tagline: "Structural strength meets visual appeal.",
    desc: "Retaining walls manage slopes, prevent soil movement and can transform an unusable yard into terraced outdoor living. We build with sleepers, concrete blocks, natural stone and more — always with proper drainage.",
    features: [
      "Timber & steel sleeper walls",
      "Concrete block & besser walls",
      "Natural & feature stone",
      "Raised garden bed walls",
      "Drainage & sub-soil solutions",
      "Engineered walls (cert. available)",
    ],
    // Not in lib/pricing.ts yet, so this guide is entered by hand
    pricing: "$350 – $800 / m²",
    pricingNote: "Face area · Material and height dependent",
    image: "/images/retaining-walls.png",
  },
];

export default function ServicesPage() {
  const [active, setActive] = useState(services[0].id);

  return (
    <>
      {/* ── Page header ───────────────────────────────────── */}
      <section className="bg-cream-50 pt-[76px] md:pt-[70px]">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 py-12 md:py-16">
          <Eyebrow className="mb-4">What We Offer</Eyebrow>
          <h1 className="font-bold tracking-tight text-[2.6rem] md:text-[3.4rem] leading-[1.05] text-ink-900 mb-5">
            Our <span className="text-violet-600">Services.</span>
          </h1>
          <p className="text-ink-700 text-[15px] leading-relaxed max-w-xl">
            Specialist trades, one team. Premium results across every outdoor project — from the ground up.
          </p>
        </div>
      </section>

      {/* ── Sticky service tabs ───────────────────────────── */}
      <div className="sticky top-[76px] md:top-[70px] z-40 bg-white border-y border-cream-200">
        <div
          className="max-w-[1800px] mx-auto px-6 md:px-10 flex overflow-x-auto gap-7"
          style={{ scrollbarWidth: "none" }}
        >
          {services.map(({ id, Icon, title }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setActive(id)}
              className={`flex items-center gap-2 py-4 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                active === id
                  ? "text-violet-600 border-violet-600"
                  : "text-ink-700 border-transparent hover:text-violet-600"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              {title}
            </a>
          ))}
        </div>
      </div>

      {/* ── Service sections (image / text alternate) ─────── */}
      {services.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className={`scroll-mt-32 py-12 md:py-20 ${i % 2 === 0 ? "bg-white" : "bg-cream-50"}`}
        >
          <div className="max-w-[1800px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <ImageSlot
              src={s.image}
              alt={s.title}
              label={`${s.title} photo — 4:3`}
              className={`aspect-[4/3] w-full rounded-sm ${i % 2 === 1 ? "md:order-2" : ""}`}
            />

            <div className="min-w-0">
              <div className="flex items-center gap-2.5 mb-4">
                <s.Icon className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
                <Eyebrow>{s.title}</Eyebrow>
              </div>
              <h2 className="font-bold tracking-tight leading-[1.1] text-ink-900 text-3xl md:text-[2.1rem] mb-5">
                {s.tagline}
              </h2>
              <p className="text-ink-700 text-sm leading-relaxed mb-7">{s.desc}</p>

              <Eyebrow className="mb-3">What&apos;s included</Eyebrow>
              <div className="grid sm:grid-cols-2 gap-y-2.5 gap-x-6 mb-7">
                {s.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-[13px] text-ink-900 leading-snug">{f}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4 bg-ink-900 rounded-sm px-5 py-4 mb-6">
                <div>
                  <p className="text-white/60 text-[10px] font-semibold tracking-[0.18em] uppercase mb-1">Rough Price Guide</p>
                  <p className="text-violet-600 font-bold text-2xl leading-tight">{s.pricing}</p>
                  <p className="text-white/60 text-[11px] mt-1">{s.pricingNote}</p>
                </div>
                <p className="text-white/70 text-[11px] leading-snug text-right hidden sm:block">
                  Free on-site<br />quote available
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2.5 px-7 py-4 bg-violet-600 text-white text-xs font-semibold tracking-wider uppercase rounded-md hover:bg-violet-700 transition-colors"
                >
                  Get a Free Quote <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:0433457437"
                  className="inline-flex items-center gap-2 px-7 py-4 border border-ink-900 bg-white text-ink-900 text-xs font-semibold tracking-wider uppercase rounded-md hover:bg-ink-900 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" /> Call Us
                </a>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── Bottom banner (same as home) ──────────────────── */}
      <section className="relative bg-ink-900 overflow-hidden">
        <div className="absolute inset-0">
          <ImageSlot
            src="/images/cta.png"
            alt=""
            label="CTA background"
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
            <p className="text-white/90 text-sm">Free on-site quotes. No obligation. We get back to you within 24 hours.</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-violet-600 text-white text-xs font-semibold tracking-wider uppercase rounded-md hover:bg-violet-700 transition-colors self-start md:self-auto"
          >
            <Phone className="w-4 h-4" /> Get a Free Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
