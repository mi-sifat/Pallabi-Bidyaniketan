"use client";

import { useState } from "react";
import Image from "next/image";
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
  Upload,
  User,
  Users,
  Home,
  BookOpen,
  Loader2,
  X,
  FileCheck,
} from "lucide-react";

export default function AdmissionPage() {
  const [activeTab, setActiveTab] = useState<"guidelines" | "onlineForm">("guidelines");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedApp, setSubmittedApp] = useState<{
    applicationNo: string;
    studentNameBn: string;
    applyingClass: string;
    fatherPhone: string;
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    applyingClass: "ষষ্ঠ শ্রেণি (Class 6)",
    studentNameBn: "",
    studentNameEn: "",
    dob: "",
    gender: "ছাত্র",
    birthRegNo: "",
    nationality: "বাংলাদেশী",
    religion: "ইসলাম",
    bloodGroup: "A+",
    presentAddress: "",
    permanentAddress: "",
    previousSchool: "",
    previousClass: "",
    previousResult: "",

    fatherName: "",
    fatherPhone: "",
    fatherNid: "",
    fatherOccupation: "",
    motherName: "",
    motherPhone: "",
    motherNid: "",
    motherOccupation: "",
    guardianName: "",
    guardianPhone: "",
    guardianRelation: "",
    emergencyPhone: "",
  });

  // File states
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [birthCertFile, setBirthCertFile] = useState<File | null>(null);
  const [marksheetFile, setMarksheetFile] = useState<File | null>(null);
  const [transferCertFile, setTransferCertFile] = useState<File | null>(null);
  const [otherDocFile, setOtherDocFile] = useState<File | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("ছবির আকার ৫ মেগাবাইটের বেশি হতে পারবে না");
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        form.append(key, val);
      });

      if (photoFile) form.append("studentPhoto", photoFile);
      if (birthCertFile) form.append("birthCertificate", birthCertFile);
      if (marksheetFile) form.append("marksheet", marksheetFile);
      if (transferCertFile) form.append("transferCertificate", transferCertFile);
      if (otherDocFile) form.append("otherDoc", otherDocFile);

      const res = await fetch("/api/admission/apply", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "আবেদন জমা দিতে সমস্যা হয়েছে");
      }

      setSubmittedApp({
        applicationNo: data.applicationNo,
        studentNameBn: formData.studentNameBn,
        applyingClass: formData.applyingClass,
        fatherPhone: formData.fatherPhone,
      });
    } catch (err: any) {
      setSubmitError(err.message || "একটি ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-10">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#1e3a5f] text-xs font-black px-3.5 py-1 rounded-full shadow-xs uppercase tracking-wider mb-2">
          <span>ভর্তি কার্যক্রম ২০২৬-২০২৭ শিক্ষাবর্ষ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1e3a5f]">
          পল্লবী বিদ্যানিকেতন ভর্তি তথ্য ও অনলাইন আবেদন
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          মিরপুর-৭, পল্লবী, ঢাকা (EIIN: ১০৮৩২৫) • শিশু শ্রেণি থেকে ১০ম শ্রেণিতে নতুন ভর্তির নিয়মাবলী, ফরম ও আবেদন
        </p>
      </div>

      {/* Navigation Switcher */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl max-w-md">
        <button
          type="button"
          onClick={() => {
            setActiveTab("guidelines");
            setSubmittedApp(null);
          }}
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

      {/* SUCCESS CONFIRMATION SCREEN */}
      {submittedApp ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 shadow-lg space-y-8 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle size={44} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
              আবেদন সফলভাবে গৃহীত হয়েছে
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1e3a5f]">
              ধন্যবাদ, {submittedApp.studentNameBn}!
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              পল্লবী বিদ্যানিকেতনে <strong className="text-gray-900">{submittedApp.applyingClass}</strong>-এ ভর্তির প্রাথমিক আবেদন সিস্টেমে সংরক্ষিত হয়েছে।
            </p>
          </div>

          {/* Reference Card */}
          <div className="bg-gray-50 border-2 border-dashed border-[#1e3a5f]/30 rounded-2xl p-6 text-left space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs text-gray-500 font-bold">আবেদন নম্বর (Application No):</span>
              <span className="text-lg font-black font-mono text-[#1e3a5f] tracking-wide">
                {submittedApp.applicationNo}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">যোগাযোগের মোবাইল:</span>
              <span className="font-bold text-gray-800">{submittedApp.fatherPhone}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">শিক্ষাবর্ষ:</span>
              <span className="font-bold text-[#c9a84c]">২০২৬-২০২৭</span>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 text-left space-y-1.5 leading-relaxed">
            <p className="font-bold flex items-center gap-1.5">
              <AlertCircle size={15} /> পরবর্তী করণীয়:
            </p>
            <p>
              ১. নিচের বাটন থেকে আপনার পূরণকৃত অফিসিয়াল A4 আবেদন ফরমটি পিডিএফ (PDF) ডাউনলোড বা প্রিন্ট করে নিন।
            </p>
            <p>
              ২. বিদ্যালয় প্রশাসন থেকে আপনার প্রদত্ত মোবাইল নম্বরে যোগাযোগ করে সাক্ষাৎকার ও চূড়ান্ত ভর্তির সময়সূচি জানানো হবে।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/admission/print/${submittedApp.applicationNo}`}
              target="_blank"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-black rounded-xl shadow-md transition-all"
            >
              <Printer size={16} />
              <span>আবেদনপত্র প্রিন্ট / পিডিএফ ডাউনলোড করুন</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setSubmittedApp(null);
                setActiveTab("guidelines");
              }}
              className="w-full sm:w-auto btn-secondary !text-xs !py-3 justify-center"
            >
              মূল পাতায় ফিরে যান
            </button>
          </div>
        </div>
      ) : activeTab === "guidelines" ? (
        /* TAB 1: GUIDELINES & BLANK FORM DOWNLOAD */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Downloadable PDF Box */}
            <div className="bg-gradient-to-r from-blue-50 to-amber-50 p-6 rounded-3xl border border-blue-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1e3a5f] text-[#c9a84c] flex items-center justify-center shadow-md shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1e3a5f] text-base">
                    অফিসিয়াল ভর্তি আবেদন ফরম (A4 Printable Form)
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    হাত দিয়ে পূরণ করে বিদ্যালয় অফিসে সরাসরি জমা দেওয়ার জন্য খালি ফরম প্রিন্ট করুন
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/admission/print/blank"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Printer size={15} />
                  <span>খালি ভর্তি ফরম প্রিন্ট / ডাউনলোড করুন</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveTab("onlineForm")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a84c] hover:bg-amber-400 text-[#1e3a5f] text-xs font-extrabold rounded-xl shadow-xs transition-colors"
                >
                  <Sparkles size={15} />
                  <span>অনলাইনে সরাসরি আবেদন করুন</span>
                </button>
              </div>
            </div>

            {/* Admission Instructions */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-2 flex items-center gap-2">
                <GraduationCap size={20} className="text-[#c9a84c]" />
                <span>ভর্তির যোগ্যতা ও সাধারণ নির্দেশনাবলী</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
                <p>
                  <strong>১. চালু থাকা শ্রেণিসমূহ:</strong> শিশু শ্রেণি (Play/Nursery), ১ম শ্রেণি, ২য় শ্রেণি, ৩য় শ্রেণি, ৪র্থ শ্রেণি, ৫ম শ্রেণি, ৬ষ্ঠ শ্রেণি, ৭ম শ্রেণি, ৮ম শ্রেণি, ৯ম শ্রেণি ও ১০ম শ্রেণি।
                </p>
                <p>
                  <strong>২. ৯ম ও ১০ম শ্রেণির বিভাগ:</strong> বিজ্ঞান বিভাগ (Science), ব্যবসায় শিক্ষা বিভাগ (Business Studies), এবং মানবিক বিভাগ (Humanities / Arts)।
                </p>
                <p>
                  <strong>৩. প্রয়োজনীয় নথিপত্র:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 text-xs">
                  <li>শিক্ষার্থীর ডিজিটাল জন্ম নিবন্ধন সনদের ফটোকপি বা মূল কপি।</li>
                  <li>পাসপোর্ট সাইজের ৩ কপি রঙিন ছবি।</li>
                  <li>পিতা ও মাতার জাতীয় পরিচয়পত্রের (NID) ফটোকপি।</li>
                  <li>পূর্ববর্তী বিদ্যালয়ের ছাড়পত্র (TC) ও পূর্ববর্তী বার্ষিক পরীক্ষার মার্কশিট (২য় থেকে ৯ম শ্রেণির ক্ষেত্রে)।</li>
                </ul>
                <p>
                  <strong>৪. সময়সূচি ও ভর্তি ফি:</strong> বিদ্যালয় নির্ধারিত ফি ব্যাংকিং রশিদের মাধ্যমে অথবা বিদ্যালয় ক্যাশ কাউন্টারে জমা দিয়ে ভর্তি নিশ্চিত করতে হবে।
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar / Helpline */}
          <div className="space-y-6">
            <div className="bg-[#1e3a5f] text-white p-6 rounded-3xl space-y-4 shadow-sm">
              <h4 className="font-bold text-sm flex items-center gap-2 text-[#c9a84c]">
                <PhoneCall size={18} />
                <span>ভর্তি হেল্পলাইন ও অফিস সময়</span>
              </h4>
              <p className="text-xs text-gray-200 leading-relaxed">
                ভর্তি সংক্রান্ত যেকোনো তথ্য ও পরামর্শের জন্য সরাসরি বিদ্যালয় অফিসে যোগাযোগ করুন।
              </p>
              <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
                <div>
                  <span className="text-gray-300 block text-[11px]">যোগাযোগ নম্বর:</span>
                  <span className="font-mono font-bold text-[#c9a84c] text-sm">+8801309108325</span>
                </div>
                <div>
                  <span className="text-gray-300 block text-[11px]">অফিস সময়:</span>
                  <span className="font-medium text-gray-200">রবিবার - বৃহস্পতিবার (সকাল ৯:০০ - দুপুর ২:৩০)</span>
                </div>
                <div>
                  <span className="text-gray-300 block text-[11px]">ঠিকানা:</span>
                  <span className="text-gray-200">মিল্কভিটা রোড, মিরপুর-৭, পল্লবী, ঢাকা-১২১৬</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: COMPLETE ONLINE APPLICATION FORM */
        <form onSubmit={handleSubmit} className="space-y-8">
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-800 flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* SECTION 1: Class Selection & Student Info */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1e3a5f] flex items-center justify-center font-bold">
                <User size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#1e3a5f] text-base sm:text-lg">
                  ১. শিক্ষার্থীর তথ্যাবলী (Student Information)
                </h3>
                <p className="text-xs text-gray-500">ভর্তির শ্রেণি ও শিক্ষার্থীর ব্যক্তিগত পরিচিতি প্রদান করুন</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label">ভর্তির শ্রেণি নির্বাচন করুন *</label>
                <select
                  required
                  value={formData.applyingClass}
                  onChange={(e) => setFormData({ ...formData, applyingClass: e.target.value })}
                  className="form-input font-bold text-[#1e3a5f]"
                >
                  <option value="শিশু শ্রেণি (Play / Nursery)">শিশু শ্রেণি (Play / Nursery)</option>
                  <option value="প্রথম শ্রেণি (Class 1)">প্রথম শ্রেণি (Class 1)</option>
                  <option value="দ্বিতীয় শ্রেণি (Class 2)">দ্বিতীয় শ্রেণি (Class 2)</option>
                  <option value="তৃতীয় শ্রেণি (Class 3)">তৃতীয় শ্রেণি (Class 3)</option>
                  <option value="চতুর্থ শ্রেণি (Class 4)">চতুর্থ শ্রেণি (Class 4)</option>
                  <option value="পঞ্চম শ্রেণি (Class 5)">পঞ্চম শ্রেণি (Class 5)</option>
                  <option value="ষষ্ঠ শ্রেণি (Class 6)">ষষ্ঠ শ্রেণি (Class 6)</option>
                  <option value="সপ্তম শ্রেণি (Class 7)">সপ্তম শ্রেণি (Class 7)</option>
                  <option value="অষ্টম শ্রেণি (Class 8)">অষ্টম শ্রেণি (Class 8)</option>
                  <option value="নবম শ্রেণি (বিজ্ঞান)">নবম শ্রেণি (বিজ্ঞান)</option>
                  <option value="নবম শ্রেণি (ব্যবসায় শিক্ষা)">নবম শ্রেণি (ব্যবসায় শিক্ষা)</option>
                  <option value="নবম শ্রেণি (মানবিক)">নবম শ্রেণি (মানবিক)</option>
                  <option value="দশম শ্রেণি (Class 10)">দশম শ্রেণি (Class 10)</option>
                </select>
              </div>

              <div>
                <label className="form-label">শিক্ষার্থীর পুরো নাম (বাংলায়) *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোঃ তামিম ইকবাল"
                  value={formData.studentNameBn}
                  onChange={(e) => setFormData({ ...formData, studentNameBn: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Student Name (In English BLOCK) *</label>
                <input
                  type="text"
                  required
                  placeholder="MD. TAMIM IQBAL"
                  value={formData.studentNameEn}
                  onChange={(e) => setFormData({ ...formData, studentNameEn: e.target.value.toUpperCase() })}
                  className="form-input font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="form-label">জন্ম তারিখ (DOB) *</label>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">লিঙ্গ / জেন্ডার *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="form-input"
                >
                  <option value="ছাত্র">ছাত্র (Male)</option>
                  <option value="ছাত্রী">ছাত্রী (Female)</option>
                </select>
              </div>

              <div>
                <label className="form-label">জন্ম নিবন্ধন নম্বর (১৭ ডিজিট) *</label>
                <input
                  type="text"
                  required
                  placeholder="20121234567890123"
                  value={formData.birthRegNo}
                  onChange={(e) => setFormData({ ...formData, birthRegNo: e.target.value })}
                  className="form-input font-mono"
                />
              </div>

              <div>
                <label className="form-label">রক্তের গ্রুপ (ঐচ্ছিক)</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="form-input"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">বর্তমান ঠিকানা *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="বাড়ি নং, রোড নং, এলাকা, থানা, জেলা..."
                  value={formData.presentAddress}
                  onChange={(e) => setFormData({ ...formData, presentAddress: e.target.value })}
                  className="form-input leading-relaxed"
                />
              </div>

              <div>
                <label className="form-label">স্থায়ী ঠিকানা *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="গ্রাম, ডাকঘর, উপজেলা, জেলা..."
                  value={formData.permanentAddress}
                  onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                  className="form-input leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Academic History */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#1e3a5f] flex items-center justify-center font-bold">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#1e3a5f] text-base sm:text-lg">
                  ২. পূর্ববর্তী শিক্ষাগত তথ্যাবলী (Previous Academic Info)
                </h3>
                <p className="text-xs text-gray-500">প্রযোজ্য ক্ষেত্রে পূর্বের স্কুল ও পরীক্ষার ফলাফল উল্লেখ করুন</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label">পূর্ববর্তী বিদ্যালয়ের নাম (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="যেমন: মিরপুর সরকারি প্রাথমিক বিদ্যালয়"
                  value={formData.previousSchool}
                  onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">সর্বশেষ উত্তীর্ণ শ্রেণি</label>
                <input
                  type="text"
                  placeholder="যেমন: ৫ম শ্রেণি"
                  value={formData.previousClass}
                  onChange={(e) => setFormData({ ...formData, previousClass: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">প্রাপ্ত জিপিএ / রোল নম্বর</label>
                <input
                  type="text"
                  placeholder="যেমন: GPA 5.00 / রোল: ১২"
                  value={formData.previousResult}
                  onChange={(e) => setFormData({ ...formData, previousResult: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Parent / Guardian Information */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Users size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#1e3a5f] text-base sm:text-lg">
                  ৩. পিতা, মাতা ও অভিভাবকের তথ্যাবলী (Parent Information)
                </h3>
                <p className="text-xs text-gray-500">যোগাযোগ ও অফিসিয়াল রেকর্ডের জন্য পিতামাতার সঠিক তথ্য দিন</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label">পিতার পুরো নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="পিতার নাম"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">পিতার মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={formData.fatherPhone}
                  onChange={(e) => setFormData({ ...formData, fatherPhone: e.target.value })}
                  className="form-input font-mono"
                />
              </div>
              <div>
                <label className="form-label">পিতার এনআইডি (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="জাতীয় পরিচয়পত্র নম্বর"
                  value={formData.fatherNid}
                  onChange={(e) => setFormData({ ...formData, fatherNid: e.target.value })}
                  className="form-input font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label">মাতার পুরো নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="মাতার নাম"
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">মাতার মোবাইল নম্বর</label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={formData.motherPhone}
                  onChange={(e) => setFormData({ ...formData, motherPhone: e.target.value })}
                  className="form-input font-mono"
                />
              </div>
              <div>
                <label className="form-label">জরুরি যোগাযোগ নম্বর *</label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  className="form-input font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Document Uploads */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                <Upload size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#1e3a5f] text-base sm:text-lg">
                  ৪. প্রয়োজনীয় নথিপত্র ও ছবি আপলোড (Document Uploads)
                </h3>
                <p className="text-xs text-gray-500">
                  সর্বোচ্চ ফাইলের আকার: ৫ মেগাবাইট (JPG, PNG, PDF)। যেকোনো সময় পরিবর্তন করা যাবে।
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Student Photo */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50 space-y-3">
                <label className="form-label">শিক্ষার্থীর পাসপোর্ট সাইজ ছবি (Student Photo)</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-white relative overflow-hidden flex items-center justify-center shrink-0">
                    {photoPreview ? (
                      <Image src={photoPreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <span className="text-[10px] text-gray-400 text-center">ছবি প্রিভিউ</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="form-input !py-1 text-xs"
                  />
                </div>
              </div>

              {/* Birth Certificate */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50 space-y-3">
                <label className="form-label">জন্ম নিবন্ধন সনদের কপি (PDF বা ছবি)</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setBirthCertFile(e.target.files?.[0] || null)}
                  className="form-input !py-1 text-xs"
                />
                {birthCertFile && (
                  <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-bold">
                    <CheckCircle size={12} /> {birthCertFile.name} ({(birthCertFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              {/* Previous Result / Marksheet */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50 space-y-3">
                <label className="form-label">পূর্ববর্তী পরীক্ষার মার্কশিট / প্রশংসাপত্র (ঐচ্ছিক)</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setMarksheetFile(e.target.files?.[0] || null)}
                  className="form-input !py-1 text-xs"
                />
                {marksheetFile && (
                  <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-bold">
                    <CheckCircle size={12} /> {marksheetFile.name}
                  </p>
                )}
              </div>

              {/* Transfer Certificate */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50 space-y-3">
                <label className="form-label">ছাড়পত্র বা টিসি (Transfer Certificate - ঐচ্ছিক)</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setTransferCertFile(e.target.files?.[0] || null)}
                  className="form-input !py-1 text-xs"
                />
                {transferCertFile && (
                  <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-bold">
                    <CheckCircle size={12} /> {transferCertFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-[#1e3a5f] to-[#2b5182] rounded-3xl text-white shadow-md">
            <div>
              <h4 className="font-bold text-base">অনলাইন ভর্তি আবেদন চূড়ান্তভাবে দাখিল করুন</h4>
              <p className="text-xs text-gray-200 mt-0.5">
                জমা দেওয়ার পর স্বয়ংক্রিয়ভাবে একটি আবেদন নম্বর ও A4 সাইজের প্রিন্টেবল কপি পাবেন
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-[#c9a84c] hover:bg-amber-400 text-[#1e3a5f] text-sm font-black rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>আবেদন জমা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>আবেদন সম্পন্ন করুন (Submit Application)</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
