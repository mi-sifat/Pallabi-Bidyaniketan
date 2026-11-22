"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Search,
  Filter,
  CheckCircle,
  Clock,
  PhoneCall,
  UserCheck,
  XCircle,
  Eye,
  Printer,
  Download,
  Calendar,
  Phone,
  FileText,
  AlertCircle,
  X,
  Loader2,
  Save,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export interface AdmissionItem {
  id: string;
  applicationNo: string;
  academicYear: string;
  applyingClass: string;
  studentNameBn: string;
  studentNameEn: string;
  dob: string;
  gender: string;
  birthRegNo: string;
  nationality: string;
  religion?: string | null;
  bloodGroup?: string | null;
  presentAddress: string;
  permanentAddress: string;
  previousSchool?: string | null;
  previousClass?: string | null;
  previousResult?: string | null;

  fatherName: string;
  fatherPhone: string;
  fatherNid?: string | null;
  fatherOccupation?: string | null;
  motherName: string;
  motherPhone?: string | null;
  motherNid?: string | null;
  motherOccupation?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  guardianRelation?: string | null;
  emergencyPhone: string;

  photoUrl?: string | null;
  birthCertificateUrl?: string | null;
  marksheetUrl?: string | null;
  transferCertificateUrl?: string | null;
  otherDocUrl?: string | null;

  status: "SUBMITTED" | "UNDER_REVIEW" | "CONTACTED" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
  contactedDate?: string | null;
  contactedBy?: string | null;
  internalNotes?: string | null;
  decisionDate?: string | null;
  finalDecision?: string | null;
  createdAt: string;
}

export default function AdmissionManager({
  initialApplications,
  initialStats,
}: {
  initialApplications: AdmissionItem[];
  initialStats: {
    total: number;
    submitted: number;
    underReview: number;
    contacted: number;
    accepted: number;
    rejected: number;
  };
}) {
  const [applications, setApplications] = useState<AdmissionItem[]>(initialApplications);
  const [stats, setStats] = useState(initialStats);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [selectedApp, setSelectedApp] = useState<AdmissionItem | null>(null);
  const [statusForm, setStatusForm] = useState<{
    status: AdmissionItem["status"];
    internalNotes: string;
    contactedBy: string;
    contactedDate: string;
    finalDecision: string;
  }>({
    status: "SUBMITTED",
    internalNotes: "",
    contactedBy: "",
    contactedDate: "",
    finalDecision: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const filteredApps = applications.filter((app) => {
    const matchQuery =
      search === "" ||
      app.applicationNo.toLowerCase().includes(search.toLowerCase()) ||
      app.studentNameBn.toLowerCase().includes(search.toLowerCase()) ||
      app.studentNameEn.toLowerCase().includes(search.toLowerCase()) ||
      app.fatherPhone.includes(search);

    const matchClass = selectedClass === "all" || app.applyingClass.includes(selectedClass);
    const matchStatus = selectedStatus === "all" || app.status === selectedStatus;

    return matchQuery && matchClass && matchStatus;
  });

  const handleOpenDetails = (app: AdmissionItem) => {
    setSelectedApp(app);
    setStatusForm({
      status: app.status,
      internalNotes: app.internalNotes || "",
      contactedBy: app.contactedBy || "",
      contactedDate: app.contactedDate ? new Date(app.contactedDate).toISOString().split("T")[0] : "",
      finalDecision: app.finalDecision || "",
    });
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/admissions/${selectedApp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statusForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "আপডেট ব্যর্থ হয়েছে");

      setApplications((prev) =>
        prev.map((a) => (a.id === selectedApp.id ? { ...a, ...statusForm } : a))
      );
      setSelectedApp((prev) => (prev ? { ...prev, ...statusForm } : null));
      showToast("success", "আবেদনের অবস্থা ও নোট সফলভাবে আপডেট করা হয়েছে!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "সংরক্ষণ ব্যর্থ";
      showToast("error", message);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: AdmissionItem["status"]) => {
    switch (status) {
      case "SUBMITTED":
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">আবেদন গৃহীত (Submitted)</span>;
      case "UNDER_REVIEW":
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">যাচাইাধীন (Under Review)</span>;
      case "CONTACTED":
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">যোগাযোগ সম্পন্ন (Contacted)</span>;
      case "ACCEPTED":
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">ভর্তি অনুমোদিত (Accepted)</span>;
      case "REJECTED":
        return <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">বাতিল (Rejected)</span>;
      case "WITHDRAWN":
        return <span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">প্রত্যাহারকৃত (Withdrawn)</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 border transition-all ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f]">
            অনলাইন ভর্তি আবেদন ব্যবস্থাপনা (Admission Management)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            শিক্ষার্থীদের জমাকৃত ভর্তি আবেদন, নথিপত্র যাচাই, যোগাযোগ ও চূড়ান্ত সিদ্ধান্ত পরিচালনা
          </p>
        </div>

        <Link
          href="/admission/print/blank"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
        >
          <Printer size={15} />
          <span>খালি ভর্তি ফরম প্রিন্ট করুন</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-gray-500">মোট আবেদন</span>
          <p className="text-2xl font-black text-[#1e3a5f]">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-blue-700">নতুন জমা (Submitted)</span>
          <p className="text-2xl font-black text-blue-900">{stats.submitted}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-amber-700">যাচাইাধীন (Review)</span>
          <p className="text-2xl font-black text-amber-900">{stats.underReview}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-indigo-200 bg-indigo-50/20 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-indigo-700">যোগাযোগকৃত (Contacted)</span>
          <p className="text-2xl font-black text-indigo-900">{stats.contacted}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-700">অনুমোদিত (Accepted)</span>
          <p className="text-2xl font-black text-emerald-900">{stats.accepted}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-red-200 bg-red-50/20 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-red-700">বাতিল (Rejected)</span>
          <p className="text-2xl font-black text-red-900">{stats.rejected}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="আবেদন নং, শিক্ষার্থীর নাম অথবা পিতার মোবাইল দিয়ে অনুসন্ধান..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input !pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="form-input text-xs !py-2"
          >
            <option value="all">সকল শ্রেণি (All Classes)</option>
            <option value="শিশু">শিশু শ্রেণি</option>
            <option value="প্রথম">প্রথম শ্রেণি</option>
            <option value="দ্বিতীয়">দ্বিতীয় শ্রেণি</option>
            <option value="তৃতীয়">তৃতীয় শ্রেণি</option>
            <option value="চতুর্থ">চতুর্থ শ্রেণি</option>
            <option value="পঞ্চম">পঞ্চম শ্রেণি</option>
            <option value="ষষ্ঠ">ষষ্ঠ শ্রেণি</option>
            <option value="সপ্তম">সপ্তম শ্রেণি</option>
            <option value="অষ্টম">অষ্টম শ্রেণি</option>
            <option value="নবম">নবম শ্রেণি</option>
            <option value="দশম">দশম শ্রেণি</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="form-input text-xs !py-2"
          >
            <option value="all">সকল অবস্থা (All Status)</option>
            <option value="SUBMITTED">নতুন জমা (Submitted)</option>
            <option value="UNDER_REVIEW">যাচাইাধীন (Under Review)</option>
            <option value="CONTACTED">যোগাযোগকৃত (Contacted)</option>
            <option value="ACCEPTED">অনুমোদিত (Accepted)</option>
            <option value="REJECTED">বাতিল (Rejected)</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-[#1e3a5f] text-base">
            আবেদনকারী তালিকা ({filteredApps.length})
          </h2>
          <span className="text-xs text-gray-400">শিক্ষাবর্ষ ২০২৬-২০২৭</span>
        </div>

        {filteredApps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                <tr>
                  <th className="p-4">আবেদন নম্বর</th>
                  <th className="p-4">শিক্ষার্থীর নাম</th>
                  <th className="p-4">ভর্তির শ্রেণি</th>
                  <th className="p-4">পিতার নাম ও মোবাইল</th>
                  <th className="p-4">জমার তারিখ</th>
                  <th className="p-4">অবস্থা</th>
                  <th className="p-4 text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#1e3a5f]">
                      {app.applicationNo}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 relative shrink-0">
                          {app.photoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={`/api/admin/admissions/${app.id}/document?field=photo`}
                              alt="Photo"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400">
                              ছবি নেই
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{app.studentNameBn}</p>
                          <p className="text-[11px] text-gray-500 font-mono">{app.studentNameEn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-gray-800">
                      {app.applyingClass}
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{app.fatherName}</p>
                      <p className="font-mono text-gray-500 text-[11px] flex items-center gap-1">
                        <Phone size={10} /> {app.fatherPhone}
                      </p>
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString("bn-BD")}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDetails(app)}
                          className="px-3 py-1.5 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={12} />
                          <span>যাচাই ও বিবরণ</span>
                        </button>
                        <Link
                          href={`/admission/print/${app.applicationNo}`}
                          target="_blank"
                          className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors inline-flex items-center"
                          title="পিডিএফ প্রিন্ট করুন"
                        >
                          <Printer size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-gray-400 space-y-2">
            <p className="text-sm font-bold text-gray-600">কোনো আবেদন পাওয়া যায়নি</p>
            <p>আপনার অনুসন্ধান বা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন</p>
          </div>
        )}
      </div>

      {/* DETAIL & STATUS MANAGEMENT MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-gray-900 text-lg">ভর্তি আবেদন বিস্তারিত</h3>
                  <span className="font-mono text-xs font-black text-[#1e3a5f] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    {selectedApp.applicationNo}
                  </span>
                </div>
                <p className="text-xs text-gray-500">ভর্তির শ্রেণি: {selectedApp.applyingClass} • শিক্ষাবর্ষ: {selectedApp.academicYear}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Student & Document Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start bg-gray-50 p-5 rounded-2xl border border-gray-200">
              <div className="sm:col-span-1 text-center space-y-3">
                <div className="w-32 h-40 mx-auto rounded-2xl overflow-hidden border-2 border-[#1e3a5f]/20 bg-white shadow-md relative">
                  {selectedApp.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/api/admin/admissions/${selectedApp.id}/document?field=photo`}
                      alt="Photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      ছবি সংযুক্ত নেই
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm">{selectedApp.studentNameBn}</h4>
                  <p className="text-xs text-gray-500 font-mono">{selectedApp.studentNameEn}</p>
                </div>
                <div className="space-y-1.5">
                  <Link
                    href={`/admission/print/${selectedApp.applicationNo}`}
                    target="_blank"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 shadow-xs transition-colors"
                  >
                    <Printer size={13} />
                    <span>A4 ফরম প্রিন্ট</span>
                  </Link>
                  <a
                    href={`/admission/print/${selectedApp.applicationNo}?download=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1e3a5f] text-white rounded-xl text-xs font-bold hover:bg-[#1e3a5f]/90 transition-colors"
                  >
                    <Download size={13} />
                    <span>ডাউনলোড PDF (ফরম + নথি)</span>
                  </a>
                </div>
              </div>

              <div className="sm:col-span-2 space-y-3 text-xs leading-relaxed text-gray-700">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-400 block text-[10px]">জন্ম তারিখ:</span>
                    <span className="font-bold">{selectedApp.dob} ({selectedApp.gender})</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">জন্ম নিবন্ধন নম্বর:</span>
                    <span className="font-mono font-bold">{selectedApp.birthRegNo}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">পিতার নাম ও মোবাইল:</span>
                    <span className="font-bold text-gray-900">{selectedApp.fatherName}</span>
                    <span className="font-mono block text-blue-800">{selectedApp.fatherPhone}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">মাতার নাম:</span>
                    <span className="font-bold text-gray-900">{selectedApp.motherName}</span>
                    {selectedApp.motherPhone && <span className="font-mono block text-gray-500">{selectedApp.motherPhone}</span>}
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 block text-[10px]">বর্তমান ঠিকানা:</span>
                    <span>{selectedApp.presentAddress}</span>
                  </div>
                </div>

                {/* Uploaded Documents Links — authenticated API (private storage) */}
                <div className="pt-3 border-t border-gray-200">
                  <span className="text-xs font-bold text-[#1e3a5f] block mb-2">সংযুক্ত নথিপত্র (Private Admin Access):</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.photoUrl && (
                      <a
                        href={`/api/admin/admissions/${selectedApp.id}/document?field=photo`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-200 rounded-lg text-xs font-bold text-[#1e3a5f] hover:bg-blue-50"
                      >
                        <FileText size={13} /> ছবি দেখুন
                      </a>
                    )}
                    {selectedApp.birthCertificateUrl && (
                      <a
                        href={`/api/admin/admissions/${selectedApp.id}/document?field=birthCert`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-200 rounded-lg text-xs font-bold text-[#1e3a5f] hover:bg-blue-50"
                      >
                        <FileText size={13} /> জন্ম সনদ
                      </a>
                    )}
                    {selectedApp.marksheetUrl && (
                      <a
                        href={`/api/admin/admissions/${selectedApp.id}/document?field=marksheet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-200 rounded-lg text-xs font-bold text-[#1e3a5f] hover:bg-blue-50"
                      >
                        <FileText size={13} /> মার্কশিট
                      </a>
                    )}
                    {selectedApp.transferCertificateUrl && (
                      <a
                        href={`/api/admin/admissions/${selectedApp.id}/document?field=transferCert`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-200 rounded-lg text-xs font-bold text-[#1e3a5f] hover:bg-blue-50"
                      >
                        <FileText size={13} /> ছাড়পত্র / টিসি
                      </a>
                    )}
                    {selectedApp.otherDocUrl && (
                      <a
                        href={`/api/admin/admissions/${selectedApp.id}/document?field=otherDoc`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-200 rounded-lg text-xs font-bold text-[#1e3a5f] hover:bg-blue-50"
                      >
                        <FileText size={13} /> অন্যান্য নথি
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* STATUS UPDATE & FOLLOW-UP FORM */}
            <form onSubmit={handleUpdateStatus} className="p-5 rounded-2xl border border-gray-200 bg-white space-y-4 text-xs sm:text-sm">
              <h4 className="font-bold text-[#1e3a5f] text-sm border-b pb-2">
                ভর্তি মূল্যায়ন ও সিদ্ধান্ত আপডেট (Administrative Workflow)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">আবেদনের বর্তমান অবস্থা *</label>
                  <select
                    value={statusForm.status}
                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value as AdmissionItem["status"] })}
                    className="form-input font-bold"
                  >
                    <option value="SUBMITTED">আবেদন গৃহীত (Submitted)</option>
                    <option value="UNDER_REVIEW">যাচাইাধীন (Under Review)</option>
                    <option value="CONTACTED">যোগাযোগ সম্পন্ন (Contacted)</option>
                    <option value="ACCEPTED">ভর্তি অনুমোদিত (Accepted)</option>
                    <option value="REJECTED">বাতিল (Rejected)</option>
                    <option value="WITHDRAWN">প্রত্যাহারকৃত (Withdrawn)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">যোগাযোগকারী কর্মকর্তার নাম</label>
                  <input
                    type="text"
                    placeholder="যেমন: মোঃ ফারুক হোসেন"
                    value={statusForm.contactedBy}
                    onChange={(e) => setStatusForm({ ...statusForm, contactedBy: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">যোগাযোগের তারিখ</label>
                  <input
                    type="date"
                    value={statusForm.contactedDate}
                    onChange={(e) => setStatusForm({ ...statusForm, contactedDate: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">অভ্যন্তরীণ নোট ও মন্তব্য (Internal Follow-up Notes)</label>
                <textarea
                  rows={2}
                  placeholder="অভিভাবকের সাথে কথা বলা হয়েছে, মূল সার্টিফিকেট নিয়ে নির্দিষ্ট তারিখে আসতে বলা হয়েছে..."
                  value={statusForm.internalNotes}
                  onChange={(e) => setStatusForm({ ...statusForm, internalNotes: e.target.value })}
                  className="form-input leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="btn-secondary !text-xs cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-primary !text-xs cursor-pointer"
                >
                  {isUpdating ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
