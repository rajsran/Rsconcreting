import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Concreting, Landscaping, Decking & Fencing Services",
  description:
    "Concrete driveways and paths, landscaping, decking, fencing and retaining walls in Melbourne. See what we offer and our indicative price guide per m².",
  alternates: { canonical: "/services" },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
