"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight, Play, Pause } from "lucide-react";
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
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Fallback default slide if none in database
  const effectiveSlides: SlideData[] =
    slides.length > 0
      ? slides
      : [
          {
            id: "default-1",
            imageUrl: "/uploads/gallery/662644585_1543229637808768_3354893254043817335_n.jpg",
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

  // Autoplay with pause on hover
  useEffect(() => {
    if (effectiveSlides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % effectiveSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [effectiveSlides.length, isPaused]);

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev === 0 ? effectiveSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % effectiveSlides.length);
  };

  // Touch Swipe for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
    touchStartX.current = null;
  };

  const current = effectiveSlides[currentIdx];
  const title = locale === "bn" ? current.titleBn || current.titleEn : current.titleEn || current.titleBn;
  const subtitle = locale === "bn" ? current.subtitleBn || current.subtitleEn : current.subtitleEn || current.subtitleBn;
  const buttonText = locale === "bn" ? current.buttonTextBn || current.buttonTextEn : current.buttonTextEn || current.buttonTextBn;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] lg:h-[580px] overflow-hidden bg-slate-950 group select-none"
    >
      {/* Background Slides with Crossfade Animation */}
      {effectiveSlides.map((slide, index) => {
        const isCurrent = index === currentIdx;
        return (
          <div
            key={slide.id}
            aria-hidden={!isCurrent}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isCurrent ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.titleBn || "School banner"}
              fill
              priority={index === 0}
              sizes="100vw"
              quality={85}
              className={`object-cover transform transition-transform duration-7000 ease-out ${
                isCurrent ? "scale-105" : "scale-100"
              }`}
            />

            {/* Gradient Overlays for High-Contrast Text Legibility */}
            <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/55 to-black/30" />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/40" />
          </div>
        );
      })}

      {/* Content Overlay */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 h-full flex flex-col justify-center max-w-6xl">
        <div className="max-w-2xl space-y-3 sm:space-y-4 text-left">
          <div className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#1e3a5f] text-[10px] sm:text-xs font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
            <span>EIIN: ১০৮৩২৫</span>
            <span>•</span>
            <span>মিরপুর-৭, ঢাকা</span>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-5xl font-black text-white leading-tight sm:leading-snug drop-shadow-md">
            {title}
          </h1>

          {subtitle && (
            <p className="text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed max-w-xl drop-shadow line-clamp-2 sm:line-clamp-3">
              {subtitle}
            </p>
          )}

          {current.buttonUrl && buttonText && (
            <div className="pt-2 sm:pt-4">
              <Link
                href={current.buttonUrl}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#c9a84c] hover:bg-amber-400 text-[#1e3a5f] font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <span>{buttonText}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Prev / Next Navigation Arrows */}
      {effectiveSlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer opacity-70 group-hover:opacity-100 hover:scale-105"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer opacity-70 group-hover:opacity-100 hover:scale-105"
            aria-label="Next Slide"
          >
            <ChevronRight size={22} />
          </button>

          {/* Indicators / Progress Dots */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/10">
            {effectiveSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIdx ? "w-6 sm:w-8 bg-[#c9a84c]" : "w-2 bg-white/40 hover:bg-white/70"
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
