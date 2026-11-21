"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  CheckCircle,
  FileText,
  Download,
  PhoneCall,
  Send,
  Calendar,
  AlertCircle,
  Sparkles,
  Printer,
  Check,
} from "lucide-react";

export default function AdmissionPage() {
  const [activeTab, setActiveTab] = useState<"guidelines" | "onlineForm">("guidelines");
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [formData, setFormData] = useState({
    studentNameBn: "",
    studentNameEn: "",
    applyingClass: "ষষ্ঠ শ্রেণি",
    gender: "ছাত্র",
    dob: "",
    birthRegNo: "",
    fatherName: "",
    fatherNid: "",
    motherName: "",
    motherNid: "",
    phone: "",
    address: "",
    previousSchool: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `PBN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setApplicationId(id);
    setSubmitted(true);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-10">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#1e3a5f] text-xs font-black px-3.5 py-1 rounded-full shadow-xs uppercase tracking-wider mb-2">
          <span>ভর্তি কার্যক্রম ২০২৬-২০২৭ শিক্ষাবর্ষ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1e3a5f]">
          ভর্তি সংক্রান্ত তথ্য, ফরম ডাউনলোড ও অনলাইন আবেদন
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          পল্লবী বিদ্যানিকেতনে (EIIN: ১০৮৩২৫) শিশু শ্রেণি থেকে ১০ম শ্রেণিতে নতুন ভর্তির নিয়মাবলী ও ফরম
        </p>
      </div>

      {/* Navigation Switcher */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab("guidelines")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === "guidelines"
              ? "bg-[#1e3a5f] text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          ভর্তি নির্দেশিকা ও অফলাইন ফরম
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("onlineForm")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "onlineForm"
              ? "bg-[#1e3a5f] text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Sparkles size={14} className="text-[#c9a84c]" />
          <span>অনলাইন ভর্তি আবেদন</span>
        </button>
      </div>

      {activeTab === "guidelines" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Downloadable PDF Box */}
            <div className="bg-gradient-to-r from-blue-50 to-amber-50 p-6 rounded-3xl border border-blue-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1e3a5f] text-[#c9a84c] flex items-center justify-center shadow-md shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1e3a5f] text-base sm:text-lg">
                    অফিশিয়াল ভর্তি আবেদন ফরম (PDF)
                  </h3>
                  <p className="text-xs text-gray-600">
                    ফরমটি ডাউনলোড বা প্রিন্ট করে হাতে পূরণপূর্বক বিদ্যালয় অফিসে সরাসরি জমা দিন
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handlePrintPdf}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Printer size={16} />
                  <span>ভর্তি ফরম প্রিন্ট / ডাউনলোড করুন (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("onlineForm")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a84c] hover:bg-amber-400 text-[#1e3a5f] text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <span>অনলাইনে পূরণ করতে চান? ক্লিক করুন</span>
                </button>
              </div>
            </div>

            {/* General Guidelines */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
                <GraduationCap className="text-[#c9a84c]" size={22} />
                <span>ভর্তির সাধারণ নিয়মাবলী</span>
              </h2>
              <ul className="text-xs sm:text-sm text-gray-700 space-y-3">
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    শিক্ষা মন্ত্রণালয় ও ঢাকা শিক্ষা বোর্ডের সরকারি ভর্তি নীতিমালা ও বয়সসীমা অনুসারে শিক্ষার্থীদের ভর্তি নেওয়া হয়।
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    শিশু শ্রেণি থেকে ৫ম শ্রেণি পর্যন্ত লটারি / মৌখিক সাক্ষাৎকার এবং ৬ষ্ঠ থেকে ৯ম শ্রেণিতে নির্ধারিত ভর্তি প্রক্রিয়া অনুসৃত হয়।
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    আবেদন ফরমের সাথে শিক্ষার্থীর ৩ কপি পাসপোর্ট সাইজ ছবি ও ডিজিটাল জন্ম সনদের সত্যায়িত ফটোকপি জমা দিতে হবে।
                  </span>
                </li>
              </ul>
            </div>

            {/* Required Documents */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="font-bold text-gray-900 text-base">
                ভর্তির সময় প্রয়োজনীয় কাগজপত্র
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-600">
                <li className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span>ডিজিটাল জন্ম নিবন্ধন সনদ (অনলাইন যাচাইযোগ্য)</span>
                </li>
                <li className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span>শিক্ষার্থীর ৩ কপি রঙিন পাসপোর্ট সাইজ ছবি</span>
                </li>
                <li className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span>পিতা ও মাতার জাতীয় পরিচয়পত্রের (NID) ফটোকপি</span>
                </li>
                <li className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span>পূর্ববর্তী বিদ্যালয়ের প্রশংসাপত্র বা ছাড়পত্র (টিসি)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Admission Help Card */}
          <div className="space-y-6">
            <div className="bg-[#1e3a5f] text-white p-6 rounded-3xl shadow-lg space-y-4">
              <div className="flex items-center gap-2 font-bold text-base text-amber-300">
                <PhoneCall size={20} />
                <span>ভর্তি তথ্য ও সহায়তা কেন্দ্র</span>
              </div>
              <p className="text-xs text-gray-200 leading-relaxed">
                বিদ্যালয়ের নতুন ভর্তি, আসন সংখ্যা ও ফি সংক্রান্ত যেকোনো তথ্যের জন্য সরাসরি অফিসে যোগাযোগ করুন অথবা ফোনে কথা বলুন।
              </p>
              <div className="space-y-2 text-xs border-t border-white/10 pt-3">
                <div className="font-bold text-amber-300">📞 হেল্পলাইন: +8801309108325</div>
                <div className="text-gray-300">✉️ ইমেইল: info@pbn.edu.bd</div>
                <div className="text-gray-300">⏰ অফিস সময়: সকাল ৯:০০ - দুপুর ২:০০</div>
                <div className="text-gray-300">📍 মিল্কভিটা রোড, মিরপুর-৭, পল্লবী, ঢাকা-১২১৬</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Online Admission Application Form */
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm max-w-3xl mx-auto space-y-6">
          {submitted ? (
            <div className="text-center py-10 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle size={36} />
              </div>
              <h2 className="text-2xl font-black text-[#1e3a5f]">
                অনলাইন ভর্তি আবেদন সফলভাবে গৃহীত হয়েছে!
              </h2>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 inline-block text-xs text-emerald-900 font-medium">
                আপনার আবেদন ট্র্যাকিং নম্বর (Application ID):{" "}
                <span className="font-black text-sm block mt-1 text-[#1e3a5f]">{applicationId}</span>
              </div>
              <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                অনুগ্রহ করে ট্র্যাকিং নম্বরটি সংরক্ষণ করুন। বিদ্যালয় কর্তৃপক্ষ আপনার দেওয়া মোবাইল নম্বরে ({formData.phone}) পরবর্তী নির্দেশনাবলী ও সাক্ষাৎকারের তারিখ এসএমএস বা কলের মাধ্যমে জানিয়ে দেবে।
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setApplicationId("");
                  }}
                  className="px-5 py-2 bg-[#1e3a5f] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  আরেকটি আবেদন ফরম পূরণ করুন
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
              <div className="border-b border-gray-200 pb-3">
                <h3 className="font-extrabold text-[#1e3a5f] text-base sm:text-lg">
                  অনলাইন ভর্তি আবেদন ফরম (২০২৬ শিক্ষাবর্ষ)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  সকল তথ্য সঠিক ও নির্ভুলভাবে বাংলায় বা ইংরেজিতে পূরণ করুন
                </p>
              </div>

              {/* Student Info */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider text-[#c9a84c]">
                  ১. শিক্ষার্থীর ব্যক্তিগত তথ্য
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      শিক্ষার্থীর নাম (বাংলায়) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.studentNameBn}
                      onChange={(e) => setFormData({ ...formData, studentNameBn: e.target.value })}
                      placeholder="যেমন: মোঃ তামিম ইকবাল"
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Student Name (English Block Letters) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.studentNameEn}
                      onChange={(e) => setFormData({ ...formData, studentNameEn: e.target.value })}
                      placeholder="e.g. MD. TAMIM IQBAL"
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ভর্তির কাঙ্ক্ষিত শ্রেণি *
                    </label>
                    <select
                      value={formData.applyingClass}
                      onChange={(e) => setFormData({ ...formData, applyingClass: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-white"
                    >
                      <option value="শিশু শ্রেণি">শিশু শ্রেণি (Play / Nursery)</option>
                      <option value="১ম শ্রেণি">১ম শ্রেণি (Class 1)</option>
                      <option value="২য় শ্রেণি">২য় শ্রেণি (Class 2)</option>
                      <option value="৩য় শ্রেণি">৩য় শ্রেণি (Class 3)</option>
                      <option value="৪র্থ শ্রেণি">৪র্থ শ্রেণি (Class 4)</option>
                      <option value="৫ম শ্রেণি">৫ম শ্রেণি (Class 5)</option>
                      <option value="৬ষ্ঠ শ্রেণি">৬ষ্ঠ শ্রেণি (Class 6)</option>
                      <option value="৭ম শ্রেণি">৭ম শ্রেণি (Class 7)</option>
                      <option value="৮ম শ্রেণি">৮ম শ্রেণি (Class 8)</option>
                      <option value="৯ম শ্রেণি (বিজ্ঞান)">৯ম শ্রেণি (বিজ্ঞান বিভাগ)</option>
                      <option value="৯ম শ্রেণি (ব্যবসায়)">৯ম শ্রেণি (ব্যবসায় শিক্ষা)</option>
                      <option value="৯ম শ্রেণি (মানবিক)">৯ম শ্রেণি (মানবিক বিভাগ)</option>
                      <option value="১০ম শ্রেণি">১০ম শ্রেণি (Class 10)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      জন্ম তারিখ *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ডিজিটাল জন্ম নিবন্ধন নম্বর *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.birthRegNo}
                      onChange={(e) => setFormData({ ...formData, birthRegNo: e.target.value })}
                      placeholder="১৭ ডিজিটের জন্ম সনদ নম্বর"
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    />
                  </div>
                </div>
              </div>

              {/* Parent Info */}
              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider text-[#c9a84c]">
                  ২. পিতা ও মাতার তথ্য
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      পিতার নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fatherName}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      placeholder="পিতার পূর্ণ নাম"
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      মাতার নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.motherName}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      placeholder="মাতার পূর্ণ নাম"
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      অভিভাবকের সক্রিয় মোবাইল নম্বর *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      পূর্ববর্তী বিদ্যালয়ের নাম (প্রযোজ্য ক্ষেত্রে)
                    </label>
                    <input
                      type="text"
                      value={formData.previousSchool}
                      onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                      placeholder="আগের স্কুলের নাম"
                      className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    বর্তমান আবাসিক ঠিকানা *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="বাড়ি নং, রোড নং, এলাকা, মিরপুর, ঢাকা"
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("guidelines")}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-extrabold rounded-xl shadow-md inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={14} />
                  <span>অনলাইনে আবেদন জমা দিন</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
