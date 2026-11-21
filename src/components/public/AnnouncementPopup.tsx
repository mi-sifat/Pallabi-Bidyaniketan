"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Megaphone, ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export interface PopupData {
  id: string;
  titleBn?: string | null;
  titleEn?: string | null;
  descriptionBn?: string | null;
  descriptionEn?: string | null;
  imageUrl?: string | null;
  buttonTextBn?: string | null;
  buttonTextEn?: string | null;
  buttonUrl?: string | null;
}

export default function AnnouncementPopup({
  popup,
  locale = "bn",
}: {
  popup: PopupData | null;
  locale?: Locale;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!popup) return;
    // Check if dismissed in this session
    const dismissedKey = `pbn_popup_${popup.id}_dismissed`;
    if (sessionStorage.getItem(dismissedKey)) {
      return;
    }

    // Small delay for smooth entry after page load
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [popup]);

  if (!popup || !isOpen) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(`pbn_popup_${popup.id}_dismissed`, "true");
    setIsOpen(false);
  };

  const title = locale === "bn" ? popup.titleBn || popup.titleEn : popup.titleEn || popup.titleBn;
  const description =
    locale === "bn"
      ? popup.descriptionBn || popup.descriptionEn
      : popup.descriptionEn || popup.descriptionBn;
  const buttonText =
    locale === "bn"
      ? popup.buttonTextBn || popup.buttonTextEn || "বিস্তারিত দেখুন"
      : popup.buttonTextEn || popup.buttonTextBn || "Learn More";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors cursor-pointer"
          aria-label="Close Announcement"
        >
          <X size={16} />
        </button>

        {/* Image Banner */}
        {popup.imageUrl ? (
          <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
            <Image
              src={popup.imageUrl}
              alt={title || "Notice"}
              fill
              sizes="(max-width: 480px) 100vw, 448px"
              quality={80}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 bg-[#c9a84c] text-[#1e3a5f] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs z-10">
              <Megaphone size={12} />
              জরুরি বিজ্ঞপ্তি
            </div>
          </div>
        ) : (
          <div className="bg-[#1e3a5f] p-5 text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c9a84c] text-[#1e3a5f] flex items-center justify-center shrink-0">
              <Megaphone size={20} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">
                গুরুত্বপূর্ণ ঘোষণা
              </span>
              <h3 className="font-extrabold text-sm sm:text-base leading-snug">
                {title}
              </h3>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          {popup.imageUrl && (
            <h3 className="font-extrabold text-[#1e3a5f] text-base leading-snug">
              {title}
            </h3>
          )}

          {description && (
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          )}

          <div className="pt-2 flex items-center gap-2">
            {popup.buttonUrl && (
              <Link
                href={popup.buttonUrl}
                onClick={handleDismiss}
                className="flex-1 py-2.5 px-4 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-bold rounded-xl shadow-xs text-center inline-flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{buttonText}</span>
                <ArrowRight size={14} />
              </Link>
            )}

            <button
              type="button"
              onClick={handleDismiss}
              className="py-2.5 px-4 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
