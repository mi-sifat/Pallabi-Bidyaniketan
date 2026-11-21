"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  UserCheck,
  UserPlus,
  Phone,
  Mail,
  ShieldAlert,
  Loader2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

interface MatchedItem {
  extractedName: string;
  dbId: string;
  dbNameEn: string;
  dbNameBn?: string | null;
  currentPhoto?: string | null;
  newPhotoFilename?: string | null;
  hasProposedUpdates: boolean;
  updates: {
    phone?: string;
    email?: string;
    designationEn?: string;
  };
}

interface NewItem {
  name: string;
  designation: string;
  mobile: string;
  email: string;
  imageFilename: string;
  originalImageUrl: string;
}

export default function MigrationReviewClient({
  report,
  existingTeachers,
}: {
  report: {
    exactMatches: MatchedItem[];
    newTeachers: NewItem[];
    totalExtracted: number;
    totalExistingDb: number;
  };
  existingTeachers: any[];
}) {
  const [activeTab, setActiveTab] = useState<"matched" | "new">("matched");
  const [matchedList, setMatchedList] = useState<MatchedItem[]>(report.exactMatches);
  const [newList, setNewList] = useState<NewItem[]>(report.newTeachers);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleApproveMatched = async (item: MatchedItem) => {
    setProcessingId(item.dbId);
    try {
      const res = await fetch("/api/admin/teachers/migration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_matched", item }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMatchedList(matchedList.filter((m) => m.dbId !== item.dbId));
      setFeedback(`"${item.extractedName}" এর তথ্য ও ছবি সফলভাবে আপডেট হয়েছে।`);
    } catch (err: any) {
      alert(err.message || "সমস্যা হয়েছে");
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveAllMatched = async () => {
    if (!confirm("আপনি কি সকল বিদ্যমান শিক্ষকের প্রস্তাবিত তথ্য ও নতুন ছবি অনুমোদন করতে চান?")) return;
    setProcessingId("all");
    try {
      const res = await fetch("/api/admin/teachers/migration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_all_matched", items: matchedList }),
      });
      if (res.ok) {
        setMatchedList([]);
        setFeedback("সকল বিদ্যমান শিক্ষকের প্রোফাইল ছবি ও তথ্য সফলভাবে আপডেট হয়েছে!");
      }
    } catch (err) {
      alert("সমস্যা হয়েছে");
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveNew = async (item: NewItem) => {
    setProcessingId(item.name);
    try {
      const res = await fetch("/api/admin/teachers/migration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_new", item }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setNewList(newList.filter((n) => n.name !== item.name));
      setFeedback(`নতুন শিক্ষক "${item.name}" সফলভাবে যুক্ত করা হয়েছে।`);
    } catch (err: any) {
      alert(err.message || "সমস্যা হয়েছে");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (item: any) => {
    if (!confirm("আপনি কি এই প্রস্তাবিত রেকর্ডটি বাতিল করতে চান?")) return;
    const identifier = item.dbId || item.name;
    setProcessingId(identifier);
    try {
      await fetch("/api/admin/teachers/migration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", item }),
      });
      if (item.dbId) {
        setMatchedList(matchedList.filter((m) => m.dbId !== item.dbId));
      } else {
        setNewList(newList.filter((n) => n.name !== item.name));
      }
      setFeedback("রেকর্ডটি বাতিল হিসেবে চিহ্নিত করা হয়েছে।");
    } catch (err) {
      alert("সমস্যা হয়েছে");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Return link */}
      <div>
        <Link
          href="/admin/teachers"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e3a5f] hover:underline"
        >
          <ArrowLeft size={14} /> শিক্ষক ব্যবস্থাপনায় ফিরে যান
        </Link>
      </div>

      {/* Toast */}
      {feedback && (
        <div className="p-3.5 bg-green-50 text-green-800 border border-green-200 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}>
            &times;
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] text-gray-500 font-bold block">মোট সংগৃহীত শিক্ষক</span>
          <span className="text-2xl font-black text-[#1e3a5f]">{report.totalExtracted} জন</span>
          <span className="text-[10px] text-gray-400 block mt-1">pbn.edu.bd এর শিক্ষক তালিকা হতে</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] text-gray-500 font-bold block">বিদ্যমান শিক্ষক ম্যাচিং</span>
          <span className="text-2xl font-black text-blue-600">{matchedList.length} জন অপেক্ষমান</span>
          <span className="text-[10px] text-gray-400 block mt-1">নতুন ছবি ও ফোন নম্বর আপডেট প্রস্তুত</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] text-gray-500 font-bold block">নতুন শিক্ষক আবিষ্কার</span>
          <span className="text-2xl font-black text-amber-600">{newList.length} জন</span>
          <span className="text-[10px] text-gray-400 block mt-1">ডাটাবেজে যুক্ত করার উপযুক্ত</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 rounded-xl">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("matched")}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer inline-flex items-center gap-1.5 ${
              activeTab === "matched"
                ? "border-[#1e3a5f] text-[#1e3a5f]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <UserCheck size={16} />
            বিদ্যমান শিক্ষকের আপডেট ({matchedList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("new")}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer inline-flex items-center gap-1.5 ${
              activeTab === "new"
                ? "border-[#1e3a5f] text-[#1e3a5f]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <UserPlus size={16} />
            নতুন শিক্ষক সংযোজন ({newList.length})
          </button>
        </div>

        {activeTab === "matched" && matchedList.length > 0 && (
          <button
            type="button"
            disabled={processingId === "all"}
            onClick={handleApproveAllMatched}
            className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg shadow-xs inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {processingId === "all" ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
            সকল আপডেট অনুমোদন করুন ({matchedList.length})
          </button>
        )}
      </div>

      {/* Tab 1: Matched Teachers */}
      {activeTab === "matched" && (
        <div className="space-y-4">
          {matchedList.map((item) => {
            const photoUrl = item.newPhotoFilename
              ? `/uploads/teachers/${item.newPhotoFilename}`
              : null;

            return (
              <div
                key={item.dbId}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {/* Photo comparison */}
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={item.extractedName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          ছবি নেই
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Information block */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-gray-900">
                        {item.extractedName}
                      </h4>
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                        আইডি ম্যাচড
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      {item.updates.designationEn && (
                        <span>পদবী: <b>{item.updates.designationEn}</b></span>
                      )}
                      {item.updates.phone && (
                        <span className="inline-flex items-center gap-1 text-gray-700">
                          <Phone size={11} className="text-[#c9a84c]" />
                          {item.updates.phone}
                        </span>
                      )}
                      {item.updates.email && (
                        <span className="inline-flex items-center gap-1 text-gray-700">
                          <Mail size={11} className="text-[#c9a84c]" />
                          {item.updates.email}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-gray-400">
                      সংরক্ষিত প্রোফাইল ছবি:{" "}
                      <span className="font-medium text-gray-600">
                        {item.currentPhoto ? "বিদ্যমান (প্রতিস্থাপিত হবে)" : "পূর্বে ছবি ছিল না (নতুন ছবি যুক্ত হবে)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    type="button"
                    disabled={processingId === item.dbId}
                    onClick={() => handleReject(item)}
                    className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="button"
                    disabled={processingId === item.dbId}
                    onClick={() => handleApproveMatched(item)}
                    className="px-4 py-1.5 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-bold rounded-lg shadow-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {processingId === item.dbId ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <CheckCircle size={13} />
                    )}
                    অনুমোদন ও আপডেট
                  </button>
                </div>
              </div>
            );
          })}

          {matchedList.length === 0 && (
            <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-400 space-y-2">
              <CheckCircle size={40} className="mx-auto text-green-500" />
              <h4 className="font-bold text-gray-700 text-sm">সকল বিদ্যমান শিক্ষকের আপডেট অনুমোদিত</h4>
              <p className="text-xs">কোনো মুলতুবি আপডেট অপেক্ষায় নেই।</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: New Teachers */}
      {activeTab === "new" && (
        <div className="space-y-4">
          {newList.map((item) => {
            const photoUrl = item.imageFilename
              ? `/uploads/teachers/${item.imageFilename}`
              : null;

            return (
              <div
                key={item.name}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        ছবি নেই
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-gray-900">
                        {item.name}
                      </h4>
                      <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                        নতুন শিক্ষক
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      <span>পদবী: <b>{item.designation || "শিক্ষক"}</b></span>
                      {item.mobile && (
                        <span className="inline-flex items-center gap-1 text-gray-700">
                          <Phone size={11} className="text-[#c9a84c]" />
                          {item.mobile}
                        </span>
                      )}
                      {item.email && (
                        <span className="inline-flex items-center gap-1 text-gray-700">
                          <Mail size={11} className="text-[#c9a84c]" />
                          {item.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    type="button"
                    disabled={processingId === item.name}
                    onClick={() => handleReject(item)}
                    className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="button"
                    disabled={processingId === item.name}
                    onClick={() => handleApproveNew(item)}
                    className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg shadow-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {processingId === item.name ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <CheckCircle size={13} />
                    )}
                    অনুমোদন ও যুক্ত করুন
                  </button>
                </div>
              </div>
            );
          })}

          {newList.length === 0 && (
            <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-400 space-y-2">
              <CheckCircle size={40} className="mx-auto text-green-500" />
              <h4 className="font-bold text-gray-700 text-sm">সকল নতুন শিক্ষক পর্যালোচিত</h4>
              <p className="text-xs">নতুন কোনো শিক্ষক অনুমোদনের জন্য অপেক্ষমান নেই।</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
