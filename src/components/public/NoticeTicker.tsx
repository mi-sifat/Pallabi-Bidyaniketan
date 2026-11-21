"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export interface NoticeItem {
  id: string;
  slug: string;
  isImportant: boolean;
  createdAt: string | Date;
  translations: Array<{
    locale: string;
    title: string;
  }>;
}

export default function NoticeTicker({
  notices,
  locale = "bn",
}: {
  notices: NoticeItem[];
  locale?: Locale;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (notices.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % notices.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [notices.length]);

  if (!notices || notices.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 flex items-center gap-4">
        <div className="flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0">
          <Bell size={14} className="animate-pulse" />
          {locale === "bn" ? "জরুরি ঘোষণা" : "Announcements"}
        </div>
        <p className="text-xs text-gray-500 italic flex-1">
          {locale === "bn"
            ? "নতুন কোনো জরুরি বিজ্ঞপ্তি প্রকাশিত হয়নি।"
            : "No emergency notices published at this moment."}
        </p>
      </div>
    );
  }

  const activeNotice = notices[currentIdx];
  const tr =
    activeNotice.translations.find((t) => t.locale === locale) ||
    activeNotice.translations[0];
  const title = tr?.title || "বিজ্ঞপ্তি";

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
      {/* Badge with Count */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs">
          <Bell size={14} className="animate-pulse" />
          <span>{locale === "bn" ? "জরুরি নোটিশ" : "Urgent Notice"}</span>
        </div>
        {notices.length > 1 && (
          <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
            {currentIdx + 1}/{notices.length}
          </span>
        )}
      </div>

      {/* Notice Title Scroller with Transition */}
      <div className="flex-1 overflow-hidden min-w-0">
        <Link
          href={`/${locale}/notices/${activeNotice.slug}`}
          className="text-xs sm:text-sm font-semibold text-[#1e3a5f] hover:text-amber-600 transition-colors line-clamp-1 block truncate"
          title={title}
        >
          {title}
        </Link>
      </div>

      {/* Action Controls & Navigation */}
      <div className="flex items-center gap-2 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
        {notices.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setCurrentIdx((prev) =>
                  prev === 0 ? notices.length - 1 : prev - 1
                )
              }
              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous Notice"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentIdx((prev) => (prev + 1) % notices.length)
              }
              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next Notice"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        <Link
          href={`/${locale}/notices`}
          className="text-xs font-bold text-[#1e3a5f] hover:text-[#c9a84c] inline-flex items-center gap-1 shrink-0 ml-1"
        >
          <span>{locale === "bn" ? "সকল নোটিশ" : "All Notices"}</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
