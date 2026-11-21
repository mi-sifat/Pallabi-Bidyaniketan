"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const [isPlaying, setIsPlaying] = useState(true);
  const touchStartX = useRef<number | null>(null);

  // Fallback default slides if none in database
  const effectiveSlides: SlideData[] =
    slides && slides.length > 0
      ? slides
      : [
          {
            id: "default-1",
            imageUrl: "/uploads/gallery/662644585_1543229637808768_3354893254043817335_n.jpg",
            titleBn: "পল্লবী বিদ্যানিকেতন — শিক্ষার আলোয় আলোকিত ভবিষ্যৎ",
            titleEn: "Pallabi Bidyaniketan — Illuminating Future with Quality Education",
            subtitleBn:
              "মিরপুর-৭, ঢাকায় অবস্থিত ঐতিহ্যবাহী ও সুশৃঙ্খল মাধ্যমিক শিক্ষাপ্রতিষ্ঠান (EIIN: ১০৮৩২৫)",
            subtitleEn:
              "A distinguished secondary educational institution in Mirpur-7, Dhaka (EIIN: 108325)",
            buttonTextBn: "আমাদের সম্পর্কে জানুন",
            buttonTextEn: "About Our School",
            buttonUrl: `/${locale}/about`,
          },
        ];

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % effectiveSlides.length);
  }, [effectiveSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev === 0 ? effectiveSlides.length - 1 : prev - 1));
  }, [effectiveSlides.length]);

  // Autoplay timer
  useEffect(() => {
    if (effectiveSlides.length <= 1 || !isPlaying) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(timer);
  }, [effectiveSlides.length, isPlaying, nextSlide]);

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

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[420px] sm:h-[480px] md:h-[540px] lg:h-[580px] overflow-hidden bg-slate-950 group select-none"
    >
      {/* Slides Container */}
      {effectiveSlides.map((slide, index) => {
        const isCurrent = index === currentIdx;
        const title =
          locale === "bn"
            ? slide.titleBn || slide.titleEn
            : slide.titleEn || slide.titleBn;
        const subtitle =
          locale === "bn"
            ? slide.subtitleBn || slide.subtitleEn
            : slide.subtitleEn || slide.subtitleBn;
        const buttonText =
          locale === "bn"
            ? slide.buttonTextBn || slide.buttonTextEn
            : slide.buttonTextEn || slide.buttonTextBn;

        return (
          <div
            key={slide.id}
            aria-hidden={!isCurrent}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isCurrent ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <Image
              src={slide.imageUrl}
              alt={title || "School banner"}
              fill
              priority={index === 0}
              sizes="100vw"
              quality={85}
              className={`object-cover transform transition-transform duration-[7000ms] ease-out ${
                isCurrent ? "scale-105" : "scale-100"
              }`}
            />

            {/* Gradient Overlays for High-Contrast Text Legibility */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.60) 50%, rgba(0,0,0,0.30) 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.20) 50%, rgba(0,0,0,0.40) 100%)",
              }}
            />

            {/* Content Overlay */}
            <div className="relative z-20 container mx-auto px-4 sm:px-6 h-full flex flex-col justify-center max-w-6xl">
              <div className="max-w-2xl space-y-3 sm:space-y-4 text-left">
                {/* Institutional Badge */}
                <div className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#1e3a5f] text-[10px] sm:text-xs font-black px-3.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                  <span>EIIN: ১০৮৩২৫</span>
                  <span>•</span>
                  <span>মিরপুর-৭, ঢাকা</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight sm:leading-snug drop-shadow-md">
                  {title}
                </h1>

                {/* Subtitle / Description */}
                {subtitle && (
                  <p className="text-xs sm:text-sm md:text-base text-gray-100 leading-relaxed max-w-xl drop-shadow line-clamp-2 sm:line-clamp-3">
                    {subtitle}
                  </p>
                )}

                {/* Call-to-action Button */}
                {slide.buttonUrl && buttonText && (
                  <div className="pt-2 sm:pt-4">
                    <Link
                      href={slide.buttonUrl}
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#c9a84c] hover:bg-amber-400 text-[#1e3a5f] font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>{buttonText}</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Prev / Next Navigation Arrows */}
      {effectiveSlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer opacity-80 group-hover:opacity-100 hover:scale-110 shadow-lg border border-white/20"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer opacity-80 group-hover:opacity-100 hover:scale-110 shadow-lg border border-white/20"
            aria-label="Next Slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Bottom Bar: Indicators & Play/Pause */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/15 shadow-md">
            {effectiveSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIdx
                    ? "w-7 sm:w-9 bg-[#c9a84c]"
                    : "w-2.5 bg-white/40 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}

            <span className="w-[1px] h-3 bg-white/20 mx-1" />

            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white/70 hover:text-white transition-colors cursor-pointer p-0.5"
              aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
              title={isPlaying ? "অটো-প্লে বন্ধ করুন" : "অটো-প্লে চালু করুন"}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
