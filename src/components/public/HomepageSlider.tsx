"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export interface SlideData {
  id: string;
  imageUrl: string;
  titleBn?: string | null;
  titleEn?: string | null;
  subtitleBn?: string | null;
  subtitleEn?: string | null;
  buttonTextBn?: string | null;
  buttonTextEn?: string | null;
  buttonUrl?: string | null;
}

export default function HomepageSlider({
  slides,
  locale = "bn",
}: {
  slides: SlideData[];
  locale?: Locale;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Fallback default slide if none in database
  const effectiveSlides: SlideData[] =
    slides.length > 0
      ? slides
      : [
          {
            id: "default-1",
            imageUrl: "/school-campus.jpg",
            titleBn: "পল্লবী বিদ্যানিকেতন — শিক্ষার আলোয় গড়ি ভবিষ্যৎ",
            titleEn: "Pallabi Bidyaniketan — Building Future with Quality Education",
            subtitleBn:
              "মিরপুর-৭, ঢাকায় অবস্থিত একটি ঐতিহ্যবাহী ও সুশৃঙ্খল মাধ্যমিক শিক্ষাপ্রতিষ্ঠান (EIIN: ১০৮৩২৫)",
            subtitleEn:
              "A distinguished secondary educational institution in Mirpur-7, Dhaka (EIIN: 108325)",
            buttonTextBn: "আমাদের সম্পর্কে জানুন",
            buttonTextEn: "About Our School",
            buttonUrl: `/${locale}/about`,
          },
        ];

  useEffect(() => {
    if (effectiveSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % effectiveSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [effectiveSlides.length]);

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev === 0 ? effectiveSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % effectiveSlides.length);
  };

  const current = effectiveSlides[currentIdx];
  const title = locale === "bn" ? current.titleBn || current.titleEn : current.titleEn || current.titleBn;
  const subtitle = locale === "bn" ? current.subtitleBn || current.subtitleEn : current.subtitleEn || current.subtitleBn;
  const buttonText = locale === "bn" ? current.buttonTextBn || current.buttonTextEn : current.buttonTextEn || current.buttonTextBn;

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] md:h-[560px] overflow-hidden bg-slate-900 group">
      {/* Background Image with smooth transition */}
      {effectiveSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIdx ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
          }`}
          style={{ transition: "opacity 1000ms ease-in-out, transform 7000ms ease-out" }}
        >
          <img
            src={slide.imageUrl}
            alt={slide.titleBn || "School banner"}
            className="w-full h-full object-cover"
          />
          {/* Subtle multi-layer overlay for rich text readability */}
          <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center max-w-6xl">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#1e3a5f] text-[11px] sm:text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
            <span>EIIN: ১০৮৩২৫</span>
            <span>•</span>
            <span>মিরপুর-৭, ঢাকা</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md">
            {title}
          </h1>

          {subtitle && (
            <p className="text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed max-w-xl drop-shadow">
              {subtitle}
            </p>
          )}

          {current.buttonUrl && buttonText && (
            <div className="pt-2">
              <Link
                href={current.buttonUrl}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a84c] hover:bg-amber-400 text-[#1e3a5f] font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all hover:scale-105"
              >
                <span>{buttonText}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Prev / Next Controls */}
      {effectiveSlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer opacity-80 group-hover:opacity-100"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer opacity-80 group-hover:opacity-100"
            aria-label="Next Slide"
          >
            <ChevronRight size={22} />
          </button>

          {/* Dots Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {effectiveSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentIdx ? "w-7 bg-[#c9a84c]" : "w-2 bg-white/50 hover:bg-white"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
