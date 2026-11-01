"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ImagePlus, Trash2, Loader2 } from "lucide-react";
import { compressImage } from "@/app/admin/compressImage";

function blobSrc(url: string) {
  return url.includes('.private.blob.vercel-storage.com')
    ? `/api/image?url=${encodeURIComponent(url)}`
    : url;
}

export default function HeroAdminClient({ initialUrls }: { initialUrls: string[] }) {
  const [urls, setUrls] = useState(initialUrls);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const compressed = await compressImage(file, 1920, 0.8);
        const form = new FormData();
        form.append("file", compressed);
        const res = await fetch("/api/admin/hero", { method: "POST", body: form });
        if (!res.ok) throw new Error(await res.text());
        const { url } = await res.json();
        setUrls(prev => [url, ...prev]);
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete(url: string) {
    if (!confirm("Remove this hero photo?")) return;
    setDeleting(url);
    const res = await fetch("/api/admin/hero", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (res.ok) setUrls(prev => prev.filter(u => u !== url));
    setDeleting(null);
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-10 py-8 md:py-10">
      <div className="mb-6">
        <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-ink-500 mb-2">Admin</p>
        <h1 className="font-bold tracking-tight text-3xl text-ink-900">
          Hero <span className="text-violet-600">Photos.</span>
        </h1>
        <p className="text-sm text-ink-500 mt-2">
          The first photo is shown as the big background image at the top of the home page.
          New uploads are added to the front of the list.
        </p>
      </div>

      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-semibold tracking-wider uppercase rounded-md transition-colors mb-8"
      >
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
        {uploading ? "Uploading\u2026" : "Add Photos"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />

      {urls.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-cream-300 rounded-sm">
          <ImagePlus className="w-10 h-10 mx-auto mb-3 text-ink-300" strokeWidth={1.25} />
          <p className="font-semibold text-ink-700">No hero photos yet</p>
          <p className="text-sm text-ink-500 mt-1">The home page is using its built-in photo. Upload one above to replace it.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {urls.map((url, i) => (
            <div key={url} className="relative rounded-sm overflow-hidden bg-cream-200 aspect-video border border-cream-200">
              <Image src={blobSrc(url)} alt={`Hero ${i + 1}`} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" unoptimized={blobSrc(url).startsWith('/api/image')} />
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleDelete(url)}
                  disabled={deleting === url}
                  aria-label="Remove photo"
                  className="bg-black/60 hover:bg-red-600 disabled:opacity-50 text-white rounded-full p-2 transition-colors"
                >
                  {deleting === url ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
              <div className={`absolute bottom-2 left-2 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-sm ${i === 0 ? "bg-violet-600 text-white" : "bg-black/55 text-white"}`}>
                {i === 0 ? "Home hero" : `Photo ${i + 1}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
