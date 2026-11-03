"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Project } from "@/lib/projects";
import { X, ChevronLeft, ChevronRight, FolderOpen, Hammer } from "lucide-react";

const LOADING_MSGS = [
  "Laying the groundwork...",
  "Pouring digital concrete...",
  "Measuring twice, loading once...",
  "Shovelling up your projects...",
  "Mixing the perfect batch...",
  "Almost ready to break ground...",
  "Fetching the blueprints...",
  "Landscaping your screen...",
  "Smoothing out the edges...",
  "Compacting the data...",
];

function blobSrc(url: string) {
  return url.includes('.private.blob.vercel-storage.com')
    ? `/api/image?url=${encodeURIComponent(url)}`
    : url;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="aspect-video bg-gray-200" />
      <div className="p-5 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  );
}

function LoadingDialog({ msg }: { msg: string }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 px-8 py-7 flex flex-col items-center gap-4 max-w-xs w-full mx-4 pointer-events-auto">
        <div className="w-14 h-14 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center">
          <Hammer className="w-6 h-6 text-violet-600 animate-bounce" />
        </div>
        <div className="text-center">
          <p className="font-bold text-ink-900 text-sm mb-1">Loading Projects</p>
          <p
            key={msg}
            className="text-gray-400 text-xs leading-relaxed transition-opacity duration-300"
          >
            {msg}
          </p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-violet-400"
              style={{ animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ p, onOpen }: { p: Project; onOpen: (startIdx: number) => void }) {
  const [idx, setIdx] = useState(0);
  const touchStartX = useRef(0);

  function goPrev(e: React.MouseEvent) {
    e.stopPropagation();
    setIdx(i => (i - 1 + p.imageUrls.length) % p.imageUrls.length);
  }

  function goNext(e: React.MouseEvent) {
    e.stopPropagation();
    setIdx(i => (i + 1) % p.imageUrls.length);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      setIdx(i =>
        delta > 0
          ? (i + 1) % p.imageUrls.length
          : (i - 1 + p.imageUrls.length) % p.imageUrls.length
      );
    }
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div
        className="relative aspect-video overflow-hidden bg-gray-100 cursor-pointer"
        onClick={() => onOpen(idx)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {p.imageUrls.length > 0 ? (
          <Image
            src={blobSrc(p.imageUrls[idx])}
            alt={p.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            No photo
          </div>
        )}

        {p.imageUrls.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
              {p.imageUrls.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === idx ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-5 cursor-pointer" onClick={() => onOpen(idx)}>
        <h2 className="font-bold text-ink-900 mb-1">{p.title}</h2>
        {p.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
        )}
      </div>
    </div>
  );
}

export default function ProjectsClient() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [msgIdx, setMsgIdx] = useState(0);
  const [selected, setSelected] = useState<Project | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [prevSrc, setPrevSrc] = useState<string | null>(null);
  const lightboxTouchX = useRef(0);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then((data: Project[]) => setProjects(data))
      .catch(() => setProjects([]));
  }, []);

  // Rotate loading messages every 1.8 s while loading
  useEffect(() => {
    if (projects !== null) return;
    const t = setInterval(() => setMsgIdx(i => (i + 1) % LOADING_MSGS.length), 1800);
    return () => clearInterval(t);
  }, [projects]);

  function openProject(p: Project, startIdx = 0) {
    setSelected(p);
    setImgIdx(startIdx);
    setPrevSrc(null);
  }

  function close() {
    setSelected(null);
    setPrevSrc(null);
  }

  function prev() {
    if (!selected) return;
    setPrevSrc(selected.imageUrls[imgIdx]);
    setImgIdx(i => (i - 1 + selected.imageUrls.length) % selected.imageUrls.length);
  }

  function next() {
    if (!selected) return;
    setPrevSrc(selected.imageUrls[imgIdx]);
    setImgIdx(i => (i + 1) % selected.imageUrls.length);
  }

  function handleLightboxTouchStart(e: React.TouchEvent) {
    lightboxTouchX.current = e.touches[0].clientX;
  }

  function handleLightboxTouchEnd(e: React.TouchEvent) {
    if (!selected) return;
    const delta = lightboxTouchX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) next(); else prev();
    }
  }

  const isLoading = projects === null;

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-1">
            Portfolio
          </p>
          <h1 className="text-3xl font-extrabold text-ink-900 mb-1">
            Our Projects
          </h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Real work by RS Concreting — concrete, landscaping, decking and fencing
            across Melbourne&apos;s West.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <FolderOpen className="w-14 h-14 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Projects coming soon.</p>
            <p className="text-sm mt-1">Check back shortly to see our latest work.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(p => (
              <ProjectCard key={p.id} p={p} onOpen={startIdx => openProject(p, startIdx)} />
            ))}
          </div>
        )}
      </section>

      {isLoading && <LoadingDialog msg={LOADING_MSGS[msgIdx]} />}

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={close}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={e => e.stopPropagation()}
            onTouchStart={handleLightboxTouchStart}
            onTouchEnd={handleLightboxTouchEnd}
          >
            <button
              onClick={close}
              className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-7 h-7" />
            </button>

            <div className="relative w-full h-[75vh] rounded-xl overflow-hidden bg-black">
              {prevSrc && (
                <Image
                  key={`prev-${prevSrc}`}
                  src={blobSrc(prevSrc)}
                  alt={selected.title}
                  fill
                  className="object-contain"
                />
              )}
              <Image
                key={imgIdx}
                src={blobSrc(selected.imageUrls[imgIdx])}
                alt={selected.title}
                fill
                className="object-contain lightbox-img-enter"
              />
            </div>

            {selected.imageUrls.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="mt-4 text-center">
              <h2 className="text-white font-bold text-lg">{selected.title}</h2>
              {selected.description && (
                <p className="text-gray-400 text-sm mt-1 max-w-xl mx-auto">
                  {selected.description}
                </p>
              )}
            </div>

            {selected.imageUrls.length > 1 && (
              <div className="flex justify-center gap-2 mt-3">
                {selected.imageUrls.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === imgIdx ? "bg-white" : "bg-gray-600 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
