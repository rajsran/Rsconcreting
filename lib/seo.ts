// Single source of truth for SEO / business details used by metadata, sitemap and JSON-LD.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://rsconcreting.com.au").replace(/\/$/, "");

export const BUSINESS = {
  name: "RS Concrete Creations & Landscaping",
  phone: "+61476863201",
  email: "info@rsconcreting.com.au",
  street: "19 Zoe Street",
  suburb: "Rockbank",
  state: "VIC",
  postcode: "3335",
  facebook: "https://www.facebook.com/share/18jjsoJ2zR/?mibextid=wwXIfr",
};

export const DEFAULT_DESCRIPTION =
  "Concrete driveways, landscaping, decking, fencing and retaining walls across Melbourne's west. Quality workmanship and free quotes from RS Concrete Creations & Landscaping.";

export const OG_IMAGE = "/images/hero.png";

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": `${SITE_URL}/#business`,
  name: BUSINESS.name,
  url: SITE_URL,
  image: `${SITE_URL}${OG_IMAGE}`,
  logo: `${SITE_URL}/logo.png`,
  description: DEFAULT_DESCRIPTION,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.street,
    addressLocality: BUSINESS.suburb,
    addressRegion: BUSINESS.state,
    postalCode: BUSINESS.postcode,
    addressCountry: "AU",
  },
  areaServed: [
    { "@type": "City", name: "Melbourne" },
    { "@type": "Place", name: "Melbourne's Western Suburbs" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "16:00",
    },
  ],
  sameAs: [BUSINESS.facebook],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: ["Concreting", "Landscaping", "Decking", "Fencing", "Retaining Walls"].map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s },
    })),
  },
};
