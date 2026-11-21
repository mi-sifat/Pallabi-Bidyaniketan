"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ImageItem {
  id: string;
  imageUrl: string;
  captionBn?: string | null;
  captionEn?: string | null;
}

export default function GalleryLightbox({
  images,
  locale,
}: {
  images: ImageItem[];
  locale: string;
}) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const openLightbox = (idx: number) => setSelectedIdx(idx);
  const closeLightbox = () => setSelectedIdx(null);

  const prevImage = () => {
    if (selectedIdx === null) return;
    setSelectedIdx(selectedIdx === 0 ? images.length - 1 : selectedIdx - 1);
  };

  const nextImage = () => {
    if (selectedIdx === null) return;
    setSelectedIdx(selectedIdx === images.length - 1 ? 0 : selectedIdx + 1);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <div
            key={img.id}
            onClick={() => openLightbox(idx)}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm group cursor-pointer hover:shadow-md transition-shadow relative"
          >
            <div className="relative h-44 w-full bg-gray-100 flex items-center justify-center">
              <img
                src={img.imageUrl}
                alt={img.captionEn || "Album image"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <ZoomIn size={24} />
              </div>
            </div>
            {img.captionBn && (
              <div className="p-2.5 text-xs text-gray-700 truncate" title={img.captionBn}>
                {locale === "bn" ? img.captionBn : img.captionEn || img.captionBn}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-amber-400 p-2 z-10 transition-colors"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-amber-400 p-3 bg-black/40 hover:bg-black/60 rounded-full transition-all"
            aria-label="Previous"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-amber-400 p-3 bg-black/40 hover:bg-black/60 rounded-full transition-all"
            aria-label="Next"
          >
            <ChevronRight size={28} />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center">
            <img
              src={images[selectedIdx].imageUrl}
              alt="Fullscreen preview"
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-4 text-center text-white text-xs sm:text-sm font-medium">
              {locale === "bn"
                ? images[selectedIdx].captionBn
                : images[selectedIdx].captionEn || images[selectedIdx].captionBn}
              <span className="block text-gray-400 text-xs mt-1">
                {selectedIdx + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
