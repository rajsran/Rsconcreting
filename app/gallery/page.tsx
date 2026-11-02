import Image from "next/image";
import Link from "next/link";

const galleryItems = [
  { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", label: "Concrete Driveway", col: "col-span-2" },
  { src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80", label: "Garden Landscaping" },
  { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80", label: "Timber Decking" },
  { src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80", label: "Concrete Slab" },
  { src: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600&q=80", label: "Retaining Wall" },
  { src: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80", label: "Colorbond Fencing", col: "col-span-2" },
  { src: "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?w=600&q=80", label: "Garden Path" },
  { src: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80", label: "Exposed Aggregate" },
  { src: "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=600&q=80", label: "Deck & Steps" },
  { src: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&q=80", label: "Landscaped Yard" },
];

export const metadata = {
  title: "Gallery",
  robots: { index: false, follow: true },
};

export default function GalleryPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-violet-600 text-sm font-semibold tracking-widest uppercase mb-3">Our Work</p>
          <h1 className="font-display font-black text-5xl md:text-6xl text-ink-900 mb-4">Gallery</h1>
          <p className="text-ink-500 text-lg max-w-2xl">
            A selection of completed projects from across Melbourne&apos;s western suburbs. Real work, real results.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[240px]">
            {galleryItems.map((item, i) => (
              <div
                key={i}
                className={`relative rounded-2xl overflow-hidden group shadow-card ${item.col ?? ""}`}
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/40 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block bg-white text-ink-900 font-semibold text-xs px-3 py-1.5 rounded-lg shadow-card">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-ink-400 text-sm mb-6">Want to see your project featured here?</p>
            <Link
              href="/contact"
              className="px-8 py-4 bg-violet-600 text-white font-semibold rounded-xl text-sm shadow-violet hover:bg-violet-700 transition-colors"
            >
              Start Your Project
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
