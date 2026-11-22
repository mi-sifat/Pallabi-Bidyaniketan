"use client";

import { useEffect } from "react";
import { Printer, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PrintTrigger() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get("download") === "true" || searchParams?.get("auto") === "true") {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/admin/admissions"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
      >
        <ArrowLeft size={14} />
        <span>ফিরে যান</span>
      </Link>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#1e3a5f] text-white text-xs font-bold hover:bg-[#2b5182] transition-colors shadow-md cursor-pointer"
      >
        <Printer size={14} />
        <span>A4 প্রিন্ট / পিডিএফ সেভ করুন (Print / Save as PDF)</span>
      </button>
    </div>
  );
}
