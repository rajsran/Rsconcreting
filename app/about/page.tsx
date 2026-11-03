import Link from "next/link";
import { ArrowRight, MapPin, Users, Leaf, Shield, Phone } from "lucide-react";
import { ImageSlot, Eyebrow, Heading } from "@/components/SiteUI";

const ABOUT_IMAGE = "/images/about.png"; // story photo (4:3)
const CTA_IMAGE = "/images/cta.png";

const values = [
  {
    icon: Shield,
    title: "Quality First",
    desc: "We never compromise on materials or workmanship. Every project gets our full effort.",
  },
  {
    icon: Users,
    title: "Family Business",
    desc: "Owner-operated by Arsdeep and Gurnaib Singh — real people who take pride in their name.",
  },
  {
    icon: MapPin,
    title: "Locally Based",
    desc: "We service Melbourne's surrounding suburbs and understand local conditions.",
  },
  {
    icon: Leaf,
    title: "Clean & Respectful",
    desc: "We treat your property like our own — clean sites, careful work, and zero mess left behind.",
  },
];

export const metadata = {
  title: "About Us",
  description:
    "Meet the team behind RS Concrete Creations & Landscaping: locally based and focused on clean, long-lasting concrete and landscaping work in Melbourne's west.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      {/* ── Page header ───────────────────────────────────── */}
      <section className="bg-cream-50 pt-[64px] md:pt-[54px]">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 py-12 md:py-16">
          <Eyebrow className="mb-4">Our Story</Eyebrow>
          <h1 className="font-bold tracking-tight text-[2.6rem] md:text-[3.4rem] leading-[1.05] text-ink-900 mb-5">
            About <span className="text-violet-600">Us.</span>
          </h1>
          <p className="text-ink-700 text-[15px] leading-relaxed max-w-xl">
            A family-run business built on hard work, honest pricing, and a passion for transforming outdoor spaces.
          </p>
        </div>
      </section>

      {/* ── Story ─────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="relative">
            <ImageSlot
              src={ABOUT_IMAGE}
              alt="Completed home exterior"
              label="Story photo — 4:3"
              className="aspect-[4/3] w-full rounded-sm"
            />
            <div className="absolute bottom-4 left-4 bg-white/95 px-4 py-3 rounded-sm shadow-card">
              <p className="text-ink-900 font-bold text-sm">Arsdeep &amp; Gurnaib Singh</p>
              <p className="text-violet-600 text-xs">Founders</p>
            </div>
          </div>

          <div className="min-w-0">
            <Eyebrow className="mb-4">Who We Are</Eyebrow>
            <Heading plain="Built from the ground up" gold="— literally." className="text-3xl md:text-[2.1rem] mb-5" />
            <div className="space-y-4 text-ink-700 text-sm leading-relaxed">
              <p>
                Groundmakers Concrete and Landscaping was founded by brothers Arsdeep and Gurnaib Singh with a simple mission: deliver premium outdoor construction work with the honesty and care of a family business.
              </p>
              <p>
                Servicing Melbourne&apos;s surrounding suburbs, we&apos;ve worked on hundreds of projects across the region &#8212; from small garden makeovers to full property transformations. Every job gets our personal attention.
              </p>
              <p>
                We believe in transparent pricing, clear communication, and craftsmanship that speaks for itself. When we finish a project, we want you to be the one telling your neighbours who did the work.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 mt-8 px-7 py-4 bg-violet-600 text-white text-xs font-semibold tracking-wider uppercase rounded-md hover:bg-violet-700 transition-colors"
            >
              Work With Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────── */}
      <section className="bg-cream-50 py-14 md:py-20">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10">
          <div className="mb-8">
            <Eyebrow className="mb-3">What We Stand For</Eyebrow>
            <h2 className="font-bold tracking-tight text-3xl md:text-[2.1rem] text-ink-900">
              Our <span className="text-violet-600">Values.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-sm px-5 py-6 shadow-sm flex flex-col gap-4">
                <v.icon className="w-7 h-7 text-violet-600" strokeWidth={1.25} />
                <div>
                  <h3 className="text-ink-900 font-bold text-sm mb-2">{v.title}</h3>
                  <p className="text-ink-700 text-[13px] leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote banner (same as home) ───────────────────── */}
      <section className="relative bg-ink-900 overflow-hidden">
        <div className="absolute inset-0">
          <ImageSlot
            src={CTA_IMAGE}
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
            <Eyebrow className="!text-white/80 mb-3">Ready to get started?</Eyebrow>
            <h2 className="font-bold tracking-tight text-3xl md:text-4xl text-white mb-2">Get a Free Quote Today.</h2>
            <p className="text-white/90 text-sm">Give us a call or send a message — we&apos;ll come to you for a free quote.</p>
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
