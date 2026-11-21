"use client";

import { useState } from "react";
import {
  Award,
  Calendar,
  FileText,
  Download,
  ExternalLink,
  Search,
  CheckCircle2,
  Copy,
  Check,
  Building,
  Monitor,
  X,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";

export interface ResultItem {
  id: string;
  titleEn: string;
  titleBn?: string | null;
  examType: string;
  academicYear: string;
  summaryEn?: string | null;
  summaryBn?: string | null;
  fileUrl?: string | null;
  createdAt: string | Date;
}

export default function ResultsExplorer({
  results,
  locale = "bn",
}: {
  results: ResultItem[];
  locale?: Locale;
}) {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [copiedEiin, setCopiedEiin] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ title: string; url: string } | null>(null);

  const examTypes = [
    { key: "all", labelBn: "সকল ফলাফল", labelEn: "All Results" },
    { key: "বার্ষিক পরীক্ষা", labelBn: "বার্ষিক পরীক্ষা", labelEn: "Annual Exams" },
    { key: "অর্ধ-বার্ষিক পরীক্ষা", labelBn: "অর্ধ-বার্ষিক", labelEn: "Half-Yearly" },
    { key: "নির্বাচনী পরীক্ষা", labelBn: "টেস্ট ও নির্বাচনী", labelEn: "Test / Pre-test" },
    { key: "এসএসসি পরীক্ষা", labelBn: "এসএসসি বোর্ড ফলাফল", labelEn: "SSC Board" },
  ];

  const years = Array.from(new Set(results.map((r) => r.academicYear))).sort(
    (a, b) => b.localeCompare(a)
  );

  const filteredResults = results.filter((r) => {
    const matchType = selectedType === "all" || r.examType === selectedType;
    const matchYear = selectedYear === "all" || r.academicYear === selectedYear;
    return matchType && matchYear;
  });

  const handleCopyEiin = () => {
    navigator.clipboard.writeText("108325");
    setCopiedEiin(true);
    setTimeout(() => setCopiedEiin(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* 1. Official Board Result Online Quick Lookup Box */}
      <div className="bg-gradient-to-r from-[#1e3a5f] via-[#244774] to-[#1e3a5f] text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/15 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-[#c9a84c] text-[#1e3a5f] text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
              <Building size={12} />
              <span>ঢাকা মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              {locale === "bn"
                ? "বোর্ড পরীক্ষার ফলাফল সরাসরি অনলাইনে দেখুন"
                : "Official Dhaka Board SSC Online Results"}
            </h2>
            <p className="text-xs text-gray-200">
              শিক্ষা বোর্ডের সেন্ট্রাল সার্ভার থেকে যেকোনো সালের এসএসসি ও জেএসসি ফলাফল অনুসন্ধান করুন
            </p>
          </div>

          {/* EIIN Copy Box */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center gap-3 shrink-0">
            <div>
              <span className="text-[10px] text-gray-300 block uppercase font-bold">বিদ্যালয়ের EIIN</span>
              <span className="text-base sm:text-lg font-black text-amber-300 tracking-wider">১০৮৩২৫ (108325)</span>
            </div>
            <button
              type="button"
              onClick={handleCopyEiin}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              title="EIIN কপি করুন"
            >
              {copiedEiin ? <Check size={16} className="text-green-300" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Board Links */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://eboardresults.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a84c] hover:bg-amber-400 text-[#1e3a5f] text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
          >
            <span>ই-বোর্ড রেজাল্ট পোর্টাল (eboardresults.com)</span>
            <ExternalLink size={14} />
          </a>
          <a
            href="http://www.educationboardresults.gov.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl border border-white/20 transition-all cursor-pointer"
          >
            <span>সরকারি এডুকেশন বোর্ড রেজাল্ট পোর্টাল</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Exam Type Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {examTypes.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setSelectedType(t.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedType === t.key
                  ? "bg-[#1e3a5f] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {locale === "bn" ? t.labelBn : t.labelEn}
            </button>
          ))}
        </div>

        {/* Year Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">শিক্ষাবর্ষ:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold border border-gray-300 rounded-xl outline-none focus:ring-1 focus:ring-[#1e3a5f] bg-white"
          >
            <option value="all">সকল বছর</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y} শিক্ষাবর্ষ
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Results List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResults.map((res) => (
          <div
            key={res.id}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1e3a5f] border border-blue-100">
                  {res.academicYear} | {res.examType}
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(res.createdAt).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US")}
                </span>
              </div>

              <h3 className="font-extrabold text-gray-900 text-sm sm:text-base group-hover:text-[#1e3a5f] transition-colors leading-snug">
                {locale === "bn" ? res.titleBn || res.titleEn : res.titleEn}
              </h3>

              {res.summaryBn && (
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {locale === "bn" ? res.summaryBn : res.summaryEn || res.summaryBn}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <CheckCircle2 size={13} />
                <span>যাচাইকৃত অফিসিয়াল গেজেট</span>
              </div>

              {res.fileUrl && (
                <button
                  type="button"
                  onClick={() =>
                    setPreviewFile({
                      title: (locale === "bn" ? res.titleBn : res.titleEn) || "ফলাফল বিবরণী",
                      url: res.fileUrl!,
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <FileText size={13} />
                  <span>শিট দেখুন ও প্রিন্ট</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredResults.length === 0 && (
          <div className="col-span-full bg-white rounded-3xl border border-gray-200 p-12 text-center text-gray-400 space-y-2">
            <Award size={40} className="mx-auto text-gray-300" />
            <h4 className="font-bold text-gray-700 text-sm">কোনো ফলাফল পাওয়া যায়নি</h4>
            <p className="text-xs">ফিল্টারের শর্ত পরিবর্তন করে পুনরায় অনুসন্ধান করুন</p>
          </div>
        )}
      </div>

      {/* Result Preview / Print Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#1e3a5f]" />
                <h3 className="font-bold text-[#1e3a5f] text-sm truncate max-w-md">
                  {previewFile.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center space-y-4 bg-slate-50">
              <div className="w-full max-h-96 rounded-2xl overflow-hidden border border-gray-300 bg-white shadow-inner flex items-center justify-center">
                <img
                  src={previewFile.url}
                  alt={previewFile.title}
                  className="max-h-96 w-auto object-contain mx-auto"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between">
              <span className="text-xs text-gray-500">পল্লবী বিদ্যানিকেতন অফিসিয়াল গেজেট</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#1e3a5f] text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1.5"
                >
                  <Download size={14} />
                  <span>প্রিন্ট / সেভ করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-semibold rounded-xl"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
