import type { Metadata, Viewport } from "next";
import { SITE_URL, BUSINESS, DEFAULT_DESCRIPTION, OG_IMAGE, localBusinessJsonLd } from "@/lib/seo";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RS Concrete Creations & Landscaping | Concreting & Landscaping Melbourne",
    template: "%s | RS Concrete Creations & Landscaping",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "concreting Melbourne",
    "concrete driveways",
    "landscaping Melbourne",
    "decking",
    "fencing",
    "retaining walls",
    "Rockbank",
    "Melbourne west",
  ],
  applicationName: BUSINESS.name,
  authors: [{ name: BUSINESS.name }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    siteName: BUSINESS.name,
    title: "RS Concrete Creations & Landscaping | Melbourne",
    description: DEFAULT_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1600, height: 900, alt: BUSINESS.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RS Concrete Creations & Landscaping | Melbourne",
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
  },
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export const viewport: Viewport = { themeColor: "#BA9662" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className="scroll-smooth">
      <body className="antialiased bg-white text-ink-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <Navbar />
        <main>{children}</main>

        <WhatsAppButton />
      </body>
    </html>
  );
}
