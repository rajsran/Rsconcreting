"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Camera, X, ImagePlus, Loader2 } from "lucide-react";
import { Project } from "@/lib/projects";
import { compressImage } from "@/app/admin/compressImage";

function blobSrc(url: string) {
  return url.includes('.private.blob.vercel-storage.com')
    ? `/api/image?url=${encodeURIComponent(url)}`
    : url;
}

type PhotoStatus = "existing" | "uploading" | "done" | "error";

interface PhotoItem {
  localUrl: string;
  status: PhotoStatus;
  uploadedUrl?: string; // set for existing or done
}

export default function EditProjectClient({ project }: { project: Project }) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [photos, setPhotos] = useState<PhotoItem[]>(
    project.imageUrls.map(url => ({ localUrl: url, status: "existing", uploadedUrl: url }))
  );
  const [removedUrls, setRemovedUrls] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const allUploaded = photos.every(p => p.status === "existing" || p.status === "done");
  const uploading = photos.some(p => p.status === "uploading");
  const newPhotos = photos.filter(p => p.status === "uploading" || p.status === "done");
  const doneCount = photos.filter(p => p.status === "done").length;

  function removePhoto(localUrl: string, uploadedUrl?: string) {
    setPhotos(p => p.filter(x => x.localUrl !== localUrl));
    // Track removed existing/uploaded blobs for server-side cleanup
    if (uploadedUrl && !uploadedUrl.startsWith("blob:")) {
      setRemovedUrls(r => [...r, uploadedUrl]);
    }
    if (localUrl.startsWith("blob:")) URL.revokeObjectURL(localUrl);
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const remaining = 10 - photos.length;
    if (remaining <= 0) return;
    const newFiles = Array.from(files).slice(0, remaining);

    const newItems: PhotoItem[] = newFiles.map(f => ({
      localUrl: URL.createObjectURL(f),
      status: "uploading",
    }));

    setPhotos(p => [...p, ...newItems]);

    newFiles.forEach(async (file, i) => {
      const localUrl = newItems[i].localUrl;
      try {
        const compressed = await compressImage(file);
        const form = new FormData();
        form.append("file", compressed, "photo.jpg");
        form.append("pathname", `projects/${project.id}/${Date.now()}-${i}.jpg`);
        const res = await fetch("/api/admin/upload", { method: "POST", body: form });
        if (!res.ok) throw new Error(await res.text());
        const { url } = await res.json();
        setPhotos(p =>
          p.map(x =>
            x.localUrl === localUrl
              ? { ...x, status: "done", uploadedUrl: url }
              : x
          )
        );
      } catch {
        setPhotos(p =>
          p.map(x => x.localUrl === localUrl ? { ...x, status: "error" } : x)
        );
      }
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !allUploaded) return;
    setSaving(true);

    const imageUrls = photos
      .filter(p => p.uploadedUrl)
      .map(p => p.uploadedUrl!);

    const res = await fetch(`/api/admin/projects/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        imageUrls,
        removedUrls,
      }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setSaving(false);
    }
  }

  return (
    <>
    {uploading && (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
        <div className="bg-white rounded-sm shadow-2xl p-8 max-w-sm w-full text-center">
          <Loader2 className="w-12 h-12 text-violet-600 animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-1">Uploading Photos</h2>
          <p className="text-sm text-gray-500 mb-4">
            {doneCount} of {newPhotos.length} uploaded
          </p>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className="bg-violet-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(doneCount / newPhotos.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-4">Please wait — do not close this page</p>
        </div>
      </div>
    )}
    {saving && (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
        <div className="bg-white rounded-sm shadow-2xl p-8 max-w-sm w-full text-center">
          <Loader2 className="w-12 h-12 text-violet-600 animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-1">Saving Project</h2>
          <p className="text-sm text-gray-500 mt-1">Please wait — do not close this page</p>
        </div>
      </div>
    )}
    <div>
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-ink-500 hover:text-violet-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="font-bold tracking-tight text-3xl text-ink-900 mb-8">Edit <span className="text-violet-600">Project.</span></h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-ink-700 mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-cream-300 bg-white rounded-md text-base focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-ink-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-cream-300 bg-white rounded-md text-base focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100 resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-semibold tracking-[0.14em] uppercase text-ink-700">Photos</label>
              <span className="text-sm text-gray-400">{photos.length} / 10</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {photos.map(p => (
                <div key={p.localUrl} className="relative aspect-square">
                  <Image src={blobSrc(p.localUrl)} alt="" fill className="object-cover rounded-md" unoptimized={blobSrc(p.localUrl).startsWith('/api/image')} />

                  {p.status === "uploading" && (
                    <div className="absolute inset-0 bg-black/40 rounded-md flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                  {p.status === "error" && (
                    <div className="absolute inset-0 bg-red-500/60 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs font-bold">Failed</span>
                    </div>
                  )}
                  {p.status === "done" && (
                    <div className="absolute inset-0 rounded-md ring-2 ring-violet-400 ring-inset pointer-events-none" />
                  )}

                  <button
                    type="button"
                    onClick={() => removePhoto(p.localUrl, p.uploadedUrl)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {photos.length < 10 && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-cream-300 bg-white rounded-md flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-violet-600 hover:text-violet-600 transition-colors"
                >
                  {photos.length === 0 ? (
                    <>
                      <ImagePlus className="w-7 h-7" />
                      <span className="text-xs text-center px-2">Tap to add photos</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-6 h-6" />
                      <span className="text-xs">Add more</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {uploading && (
              <p className="text-xs text-violet-500 mt-2 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Uploading photos in background…
              </p>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => { handleFiles(e.target.files); e.target.value = ""; }}
            />
          </div>

          <button
            type="submit"
            disabled={saving || !title.trim() || !allUploaded || photos.some(p => p.status === "error")}
            className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold tracking-wider uppercase rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : uploading ? "Waiting for uploads…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
