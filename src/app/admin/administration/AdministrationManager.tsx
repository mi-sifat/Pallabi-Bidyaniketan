"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Building2,
  Users,
  Plus,
  CheckCircle,
  Clock,
  Trash2,
  Edit2,
  Save,
  Loader2,
  X,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";

export interface AdminProfileItem {
  id: string;
  profileType: "HEAD_TEACHER" | "ASSISTANT_HEAD" | "COMMITTEE_CHAIR" | "COMMITTEE_MEMBER" | "ADMIN_STAFF" | "FORMER_HEAD";
  nameEn: string;
  nameBn?: string | null;
  designationEn?: string | null;
  designationBn?: string | null;
  photoUrl?: string | null;
  bioEn?: string | null;
  bioBn?: string | null;
  messageEn?: string | null;
  messageBn?: string | null;
  phone?: string | null;
  email?: string | null;
  qualificationsEn?: string | null;
  qualificationsBn?: string | null;
  displayOrder: number;
  isPublished: boolean;
  status: string;
}

export default function AdministrationManager({
  initialProfiles,
}: {
  initialProfiles: AdminProfileItem[];
}) {
  const [profiles, setProfiles] = useState<AdminProfileItem[]>(initialProfiles);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const headTeacher = profiles.find((p) => p.profileType === "HEAD_TEACHER");
  const asstHeadTeacher = profiles.find((p) => p.profileType === "ASSISTANT_HEAD");
  const committeeMembers = profiles.filter(
    (p) => p.profileType !== "HEAD_TEACHER" && p.profileType !== "ASSISTANT_HEAD"
  );

  // Leadership Edit State
  const [headForm, setHeadForm] = useState<Partial<AdminProfileItem>>({
    nameBn: headTeacher?.nameBn || "মোঃ শাহে আলম",
    nameEn: headTeacher?.nameEn || "MD. SHAHE ALAM",
    designationBn: headTeacher?.designationBn || "প্রধান শিক্ষক",
    designationEn: headTeacher?.designationEn || "Headmaster",
    photoUrl: headTeacher?.photoUrl || "/uploads/teachers/MD_SHAHE_ALAM.jpg",
    qualificationsBn: headTeacher?.qualificationsBn || "এম.এ, বি.এড",
    qualificationsEn: headTeacher?.qualificationsEn || "M.A, B.Ed",
    phone: headTeacher?.phone || "+8801309108325",
    email: headTeacher?.email || "headmaster@pbn.edu.bd",
    messageBn:
      headTeacher?.messageBn ||
      "পল্লবী বিদ্যানিকেতন প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভার বিকাশ ও দেশপ্রেমিক সুনাগরিক হিসেবে গড়ে তুলতে নিরলস কাজ করে যাচ্ছে। আমাদের লক্ষ্য আধুনিক প্রযুক্তিনির্ভর ও মূল্যবোধভিত্তিক শিক্ষাদান।",
    isPublished: headTeacher?.isPublished ?? true,
  });

  const [asstForm, setAsstForm] = useState<Partial<AdminProfileItem>>({
    nameBn: asstHeadTeacher?.nameBn || "রাজিয়া সুলতানা",
    nameEn: asstHeadTeacher?.nameEn || "RAJIA SULTANA",
    designationBn: asstHeadTeacher?.designationBn || "সহকারী প্রধান শিক্ষক",
    designationEn: asstHeadTeacher?.designationEn || "Assistant Headmaster",
    photoUrl: asstHeadTeacher?.photoUrl || "/uploads/teachers/RAJIA_SULTANA.jpg",
    qualificationsBn: asstHeadTeacher?.qualificationsBn || "এম.এস.সি, বি.এড",
    qualificationsEn: asstHeadTeacher?.qualificationsEn || "M.Sc, B.Ed",
    phone: asstHeadTeacher?.phone || "+8801309108325",
    email: asstHeadTeacher?.email || "asst.head@pbn.edu.bd",
    messageBn: asstHeadTeacher?.messageBn || "সহকারী প্রধান শিক্ষক হিসেবে শিক্ষার্থীদের সার্বিক পাঠদান ও শৃঙ্খলার মান নিশ্চিত করতে আমরা সর্বদা সচেষ্ট।",
    isPublished: asstHeadTeacher?.isPublished ?? true,
  });

  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Committee Modal
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<AdminProfileItem | null>(null);
  const [memberForm, setMemberForm] = useState({
    nameBn: "",
    nameEn: "",
    designationBn: "কমিটি সদস্য",
    designationEn: "Member",
    profileType: "COMMITTEE_MEMBER" as AdminProfileItem["profileType"],
    photoUrl: "",
    phone: "",
    email: "",
    displayOrder: 10,
    isPublished: true,
  });

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  // Save Head Teacher
  const handleSaveHeadTeacher = async () => {
    setSavingKey("head");
    try {
      if (headTeacher?.id) {
        const res = await fetch(`/api/admin/administration/${headTeacher.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(headForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "আপডেট ব্যর্থ হয়েছে");
        setProfiles((prev) =>
          prev.map((p) => (p.id === headTeacher.id ? data.profile : p))
        );
      } else {
        const res = await fetch("/api/admin/administration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...headForm,
            profileType: "HEAD_TEACHER",
            displayOrder: 1,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "তৈরি ব্যর্থ হয়েছে");
        setProfiles((prev) => [...prev, data.profile]);
      }
      showToast("success", "প্রধান শিক্ষকের প্রোফাইল ও বাণী সফলভাবে সংরক্ষিত হয়েছে!");
    } catch (err: any) {
      showToast("error", err.message || "সংরক্ষণ করা যায়নি");
    } finally {
      setSavingKey(null);
    }
  };

  // Save Assistant Head Teacher
  const handleSaveAsstHeadTeacher = async () => {
    setSavingKey("asst");
    try {
      if (asstHeadTeacher?.id) {
        const res = await fetch(`/api/admin/administration/${asstHeadTeacher.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(asstForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "আপডেট ব্যর্থ হয়েছে");
        setProfiles((prev) =>
          prev.map((p) => (p.id === asstHeadTeacher.id ? data.profile : p))
        );
      } else {
        const res = await fetch("/api/admin/administration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...asstForm,
            profileType: "ASSISTANT_HEAD",
            displayOrder: 2,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "তৈরি ব্যর্থ হয়েছে");
        setProfiles((prev) => [...prev, data.profile]);
      }
      showToast("success", "সহকারী প্রধান শিক্ষকের প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!");
    } catch (err: any) {
      showToast("error", err.message || "সংরক্ষণ করা যায়নি");
    } finally {
      setSavingKey(null);
    }
  };

  // Committee Member Create / Update
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKey("memberModal");
    try {
      if (editingMember) {
        const res = await fetch(`/api/admin/administration/${editingMember.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(memberForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "আপডেট ব্যর্থ হয়েছে");
        setProfiles((prev) =>
          prev.map((p) => (p.id === editingMember.id ? data.profile : p))
        );
        showToast("success", "সদস্যের তথ্য সফলভাবে আপডেট করা হয়েছে!");
      } else {
        const res = await fetch("/api/admin/administration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(memberForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "যুক্ত করা যায়নি");
        setProfiles((prev) => [...prev, data.profile]);
        showToast("success", "নতুন সদস্য সফলভাবে যুক্ত করা হয়েছে!");
      }
      setIsMemberModalOpen(false);
      setEditingMember(null);
    } catch (err: any) {
      showToast("error", err.message || "সংরক্ষণ ব্যর্থ হয়েছে");
    } finally {
      setSavingKey(null);
    }
  };

  // Delete Member
  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে "${name}"-কে তালিকা থেকে মুছে ফেলতে চান?`)) return;
    try {
      const res = await fetch(`/api/admin/administration/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("মুছে ফেলা যায়নি");
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      showToast("success", `"${name}" সফলভাবে মুছে ফেলা হয়েছে`);
    } catch (err: any) {
      showToast("error", err.message || "মুছে ফেলা যায়নি");
    }
  };

  return (
    <div className="space-y-10 max-w-6xl">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 border transition-all ${toast.type === "success"
            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
            : "bg-red-50 text-red-800 border-red-200"
            }`}
        >
          {toast.type === "success" ? <CheckCircle size={18} /> : <X size={18} />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f]">
          প্রশাসন ও পরিচালনা পর্ষদ ব্যবস্থাপনা
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          প্রধান শিক্ষক, সহকারী প্রধান শিক্ষক এবং পরিচালনা কমিটির কেন্দ্রীয় প্রোফাইল পরিচালনা
        </p>
      </div>

      {/* 1. Head Teacher Management Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1e3a5f] text-[#c9a84c] flex items-center justify-center font-bold text-xl shadow-xs">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1e3a5f]">
                প্রধান শিক্ষকের প্রোফাইল ও বাণী (Head Teacher)
              </h2>
              <p className="text-xs text-gray-500">
                হোমপেজ, প্রশাসন ও প্রধান শিক্ষকের বাণী পেজে এই তথ্য একযোগে প্রদর্শিত হবে
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={headForm.isPublished}
                onChange={(e) => setHeadForm({ ...headForm, isPublished: e.target.checked })}
                className="w-4 h-4 rounded text-[#1e3a5f]"
              />
              <span>ওয়েবসাইটে দৃশ্যমান</span>
            </label>
            <button
              type="button"
              onClick={handleSaveHeadTeacher}
              disabled={savingKey === "head"}
              className="btn-primary !text-xs !py-2 !px-4"
            >
              {savingKey === "head" ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <Save size={14} /> পরিবর্তন সংরক্ষণ করুন
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Photo & Preview */}
          <div className="lg:col-span-4 bg-gray-50 p-6 rounded-2xl border border-gray-200 text-center space-y-4">
            <div className="w-36 h-48 mx-auto rounded-2xl overflow-hidden border-2 border-[#1e3a5f]/30 shadow-md relative bg-white">
              {headForm.photoUrl ? (
                <Image
                  src={headForm.photoUrl}
                  alt={headForm.nameBn || "Headmaster"}
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  কোনো ছবি নেই
                </div>
              )}
            </div>

            <MediaPicker
              value={headForm.photoUrl}
              onChange={(url) => setHeadForm((prev) => ({ ...prev, photoUrl: url }))}
              label="ছবি পরিবর্তন / নির্বাচন"
              category="teachers"
            />

            <div className="text-left text-xs space-y-1.5 text-gray-600 pt-2 border-t border-gray-200">
              <p className="font-bold text-[#1e3a5f]">{headForm.nameBn} ({headForm.nameEn})</p>
              <p className="text-gray-500">{headForm.designationBn} • {headForm.qualificationsBn}</p>
              <p className="text-gray-500">ফোন: {headForm.phone}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-8 space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">নাম (বাংলা) *</label>
                <input
                  type="text"
                  value={headForm.nameBn || ""}
                  onChange={(e) => setHeadForm({ ...headForm, nameBn: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">নাম (ইংরেজি) *</label>
                <input
                  type="text"
                  value={headForm.nameEn || ""}
                  onChange={(e) => setHeadForm({ ...headForm, nameEn: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">পদবী (বাংলা)</label>
                <input
                  type="text"
                  value={headForm.designationBn || ""}
                  onChange={(e) => setHeadForm({ ...headForm, designationBn: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">পদবী (ইংরেজি)</label>
                <input
                  type="text"
                  value={headForm.designationEn || ""}
                  onChange={(e) => setHeadForm({ ...headForm, designationEn: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">শিক্ষাগত যোগ্যতা</label>
                <input
                  type="text"
                  placeholder="যেমন: এম.এ, বি.এড"
                  value={headForm.qualificationsBn || ""}
                  onChange={(e) => setHeadForm({ ...headForm, qualificationsBn: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">অফিসিয়াল মোবাইল / ফোন</label>
                <input
                  type="text"
                  placeholder="+8801309108325"
                  value={headForm.phone || ""}
                  onChange={(e) => setHeadForm({ ...headForm, phone: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="form-label">প্রধান শিক্ষকের বাণী / বার্তা (বাংলা)</label>
              <textarea
                rows={4}
                value={headForm.messageBn || ""}
                onChange={(e) => setHeadForm({ ...headForm, messageBn: e.target.value })}
                className="form-input leading-relaxed"
                placeholder="বিদ্যালয়ের শিক্ষার্থীদের উদ্দেশ্যে প্রধান শিক্ষকের শুভেচ্ছা বাণী..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Assistant Head Teacher Management Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1e3a5f]">
                সহকারী প্রধান শিক্ষকের প্রোফাইল (Assistant Head Teacher)
              </h2>
              <p className="text-xs text-gray-500">
                প্রশাসন পেজে সহকারী প্রধান শিক্ষকের তথ্য ও ছবি প্রদর্শিত হবে
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={asstForm.isPublished}
                onChange={(e) => setAsstForm({ ...asstForm, isPublished: e.target.checked })}
                className="w-4 h-4 rounded text-[#1e3a5f]"
              />
              <span>ওয়েবসাইটে দৃশ্যমান</span>
            </label>
            <button
              type="button"
              onClick={handleSaveAsstHeadTeacher}
              disabled={savingKey === "asst"}
              className="btn-primary !text-xs !py-2 !px-4"
            >
              {savingKey === "asst" ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <Save size={14} /> পরিবর্তন সংরক্ষণ করুন
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Photo & Preview */}
          <div className="lg:col-span-4 bg-gray-50 p-6 rounded-2xl border border-gray-200 text-center space-y-4">
            <div className="w-36 h-48 mx-auto rounded-2xl overflow-hidden border-2 border-[#1e3a5f]/30 shadow-md relative bg-white">
              {asstForm.photoUrl ? (
                <Image
                  src={asstForm.photoUrl}
                  alt={asstForm.nameBn || "Assistant Headmaster"}
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  কোনো ছবি নেই
                </div>
              )}
            </div>

            <MediaPicker
              value={asstForm.photoUrl}
              onChange={(url) => setAsstForm((prev) => ({ ...prev, photoUrl: url }))}
              label="ছবি পরিবর্তন / নির্বাচন"
              category="teachers"
            />

            <div className="text-left text-xs space-y-1.5 text-gray-600 pt-2 border-t border-gray-200">
              <p className="font-bold text-[#1e3a5f]">{asstForm.nameBn} ({asstForm.nameEn})</p>
              <p className="text-gray-500">{asstForm.designationBn} • {asstForm.qualificationsBn}</p>
              <p className="text-gray-500">ফোন: {asstForm.phone}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-8 space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">নাম (বাংলা) *</label>
                <input
                  type="text"
                  value={asstForm.nameBn || ""}
                  onChange={(e) => setAsstForm({ ...asstForm, nameBn: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">নাম (ইংরেজি) *</label>
                <input
                  type="text"
                  value={asstForm.nameEn || ""}
                  onChange={(e) => setAsstForm({ ...asstForm, nameEn: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">পদবী (বাংলা)</label>
                <input
                  type="text"
                  value={asstForm.designationBn || ""}
                  onChange={(e) => setAsstForm({ ...asstForm, designationBn: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">পদবী (ইংরেজি)</label>
                <input
                  type="text"
                  value={asstForm.designationEn || ""}
                  onChange={(e) => setAsstForm({ ...asstForm, designationEn: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">শিক্ষাগত যোগ্যতা</label>
                <input
                  type="text"
                  placeholder="যেমন: এম.এস.সি, বি.এড"
                  value={asstForm.qualificationsBn || ""}
                  onChange={(e) => setAsstForm({ ...asstForm, qualificationsBn: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">মোবাইল / যোগাযোগ</label>
                <input
                  type="text"
                  placeholder="+8801309108325"
                  value={asstForm.phone || ""}
                  onChange={(e) => setAsstForm({ ...asstForm, phone: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="form-label">সংক্ষিপ্ত পরিচিতি বা বার্তা</label>
              <textarea
                rows={3}
                value={asstForm.messageBn || ""}
                onChange={(e) => setAsstForm({ ...asstForm, messageBn: e.target.value })}
                className="form-input leading-relaxed"
                placeholder="সহকারী প্রধান শিক্ষকের পরিচিতি বা বার্তা..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Managing Committee & Other Administrative Members */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1e3a5f]">
              পরিচালনা কমিটি ও প্রশাসনিক সদস্যবৃন্দ ({committeeMembers.length})
            </h2>
            <p className="text-xs text-gray-500">
              ম্যানেজিং কমিটির সভাপতি, সদস্য এবং প্রাক্তন প্রধান শিক্ষকদের তালিকা
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingMember(null);
              setMemberForm({
                nameBn: "",
                nameEn: "",
                designationBn: "কমিটি সদস্য",
                designationEn: "Member",
                profileType: "COMMITTEE_MEMBER",
                photoUrl: "",
                phone: "",
                email: "",
                displayOrder: committeeMembers.length + 3,
                isPublished: true,
              });
              setIsMemberModalOpen(true);
            }}
            className="btn-primary !text-xs !py-2"
          >
            <Plus size={16} /> নতুন সদস্য যোগ করুন
          </button>
        </div>

        {committeeMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {committeeMembers.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-14 rounded-xl overflow-hidden border border-gray-200 bg-white relative shrink-0">
                    {m.photoUrl ? (
                      <Image src={m.photoUrl} alt={m.nameBn || m.nameEn} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">
                        {m.nameBn?.slice(0, 2) || "সদ"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{m.nameBn || m.nameEn}</h3>
                    <p className="text-gray-500 truncate">{m.designationBn}</p>
                    <span className="text-[10px] text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded font-medium mt-1 inline-block">
                      {m.profileType === "COMMITTEE_CHAIR" ? "সভাপতি" : "কমিটি সদস্য"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMember(m);
                      setMemberForm({
                        nameBn: m.nameBn || "",
                        nameEn: m.nameEn,
                        designationBn: m.designationBn || "",
                        designationEn: m.designationEn || "",
                        profileType: m.profileType,
                        photoUrl: m.photoUrl || "",
                        phone: m.phone || "",
                        email: m.email || "",
                        displayOrder: m.displayOrder,
                        isPublished: m.isPublished,
                      });
                      setIsMemberModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-[#1e3a5f] hover:bg-white border border-transparent hover:border-gray-200 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteMember(m.id, m.nameBn || m.nameEn)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-white border border-transparent hover:border-red-100 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-400 border border-dashed rounded-2xl">
            বর্তমানে কোনো অতিরিক্ত কমিটি সদস্য নেই। &quot;নতুন সদস্য যোগ করুন&quot; বাটনে ক্লিক করে যোগ করতে পারেন।
          </div>
        )}
      </div>

      {/* Member Create / Edit Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base">
                {editingMember ? "সদস্যের তথ্য সম্পাদনা" : "নতুন প্রশাসনিক / কমিটি সদস্য যোগ"}
              </h3>
              <button
                type="button"
                onClick={() => setIsMemberModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={memberForm.nameBn}
                    onChange={(e) => setMemberForm({ ...memberForm, nameBn: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">নাম (ইংরেজি)</label>
                  <input
                    type="text"
                    value={memberForm.nameEn}
                    onChange={(e) => setMemberForm({ ...memberForm, nameEn: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">পদবী (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={memberForm.designationBn}
                    onChange={(e) => setMemberForm({ ...memberForm, designationBn: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">ক্যাটাগরি</label>
                  <select
                    value={memberForm.profileType}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, profileType: e.target.value as any })
                    }
                    className="form-input"
                  >
                    <option value="COMMITTEE_CHAIR">সভাপতি (Committee Chair)</option>
                    <option value="COMMITTEE_MEMBER">কমিটি সদস্য (Member)</option>
                    <option value="ADMIN_STAFF">প্রশাসনিক কর্মকর্তা / স্টাফ</option>
                    <option value="FORMER_HEAD">প্রাক্তন প্রধান শিক্ষক</option>
                  </select>
                </div>
              </div>

              <div>
                <MediaPicker
                  value={memberForm.photoUrl}
                  onChange={(url) => setMemberForm((prev) => ({ ...prev, photoUrl: url }))}
                  label="সদস্যের ছবি"
                  category="teachers"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="btn-secondary !text-xs cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={savingKey === "memberModal"}
                  className="btn-primary !text-xs cursor-pointer"
                >
                  {savingKey === "memberModal" ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

