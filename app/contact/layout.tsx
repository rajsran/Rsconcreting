import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Free Quote",
  description:
    "Get a free quote for concreting, landscaping, decking or fencing in Melbourne's west. Call 0476 863 201 or send us a message. Based in Rockbank, VIC.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
