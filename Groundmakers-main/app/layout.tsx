import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Groundmakers Concrete & Landscaping | Rockbank, VIC",
  description:
    "Premium concrete, landscaping, decking, fencing and retaining wall services in Melbourne's west. Contact Groundmakers for a free quote.",
  keywords: "concrete, landscaping, decking, fencing, retaining walls, Rockbank, Melbourne",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-white text-ink-900">
        <Navbar />
        <main>{children}</main>

        <WhatsAppButton />
      </body>
    </html>
  );
}
