"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  CheckCircle,
  Clock,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  X,
  Loader2,
  Search,
} from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";

interface Teacher {
  id: string;
  nameEn: string;
  nameBn?: string | null;
  designationEn?: string | null;
  designationBn?: string | null;
  subjectEn?: string | null;
  subjectBn?: string | null;
  photoUrl?: string | null;
  qualificationsEn?: string | null;
  qualificationsBn?: string | null;
  displayOrder: number;
  isPublished: boolean;
  isCurrent: boolean;
  status: string;
}

export default function TeacherManager({
  initialTeachers,
}: {
  initialTeachers: Teacher[];
}) {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [nameEn, setNameEn] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [designationEn, setDesignationEn] = useState("");
  const [designationBn, setDesignationBn] = useState("");
  const [subjectEn, setSubjectEn] = useState("");
  const [subjectBn, setSubjectBn] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [qualificationsBn, setQualificationsBn] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const openAddModal = () => {
    setEditingTeacher(null);
    setNameEn("");
    setNameBn("");
    setDesignationEn("Assistant Teacher");
    setDesignationBn("সহকারী শিক্ষক");
    setSubjectEn("");
    setSubjectBn("");
    setPhotoUrl("");
    setQualificationsBn("");
    setDisplayOrder(teachers.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (t: Teacher) => {
    setEditingTeacher(t);
    setNameEn(t.nameEn);
    setNameBn(t.nameBn || "");
    setDesignationEn(t.designationEn || "");
    setDesignationBn(t.designationBn || "");
    setSubjectEn(t.subjectEn || "");
    setSubjectBn(t.subjectBn || "");
    setPhotoUrl(t.photoUrl || "");
    setQualificationsBn(t.qualificationsBn || "");
    setDisplayOrder(t.displayOrder);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn) return alert("শিক্ষকের নাম (ইংরেজি) আবশ্যক");
    setSubmitting(true);

    const payload = {
      nameEn,
      nameBn: nameBn || nameEn,
      designationEn,
      designationBn: designationBn || designationEn,
      subjectEn,
      subjectBn: subjectBn || subjectEn,
      photoUrl: photoUrl || null,
      qualificationsBn,
      qualificationsEn: qualificationsBn,
      displayOrder: Number(displayOrder),
      isPublished: true,
      status: "PUBLISHED",
    };

    try {
      if (editingTeacher) {
        const res = await fetch(`/api/admin/teachers/${editingTeacher.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        setTeachers((prev) =>
          prev.map((t) => (t.id === editingTeacher.id ? { ...t, ...updated } : t))
        );
      } else {
        const res = await fetch("/api/admin/teachers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        setTeachers((prev) => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save teacher error:", err);
      alert("শিক্ষক তথ্য সংরক্ষণ ব্যর্থ হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  const togglePublish = async (t: Teacher) => {
    const newStatus = !t.isPublished;
    try {
      const res = await fetch(`/api/admin/teachers/${t.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPublished: newStatus,
          status: newStatus ? "PUBLISHED" : "DRAFT",
        }),
      });
      if (res.ok) {
        setTeachers((prev) =>
          prev.map((item) => (item.id === t.id ? { ...item, isPublished: newStatus } : item))
        );
      }
    } catch (err) {
      console.error("Toggle publish error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই শিক্ষকের তথ্য মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/admin/teachers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTeachers((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error("Delete teacher error:", err);
    }
  };

  const filteredTeachers = teachers.filter(
    (t) =>
      (t.nameEn.toLowerCase() || "").includes(search.toLowerCase()) ||
      (t.nameBn || "").includes(search) ||
      (t.designationBn || "").includes(search) ||
      (t.subjectBn || "").includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="শিক্ষকের নাম বা বিষয় দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
          />
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="w-full sm:w-auto px-4 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-bold rounded-lg shadow-xs inline-flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          নতুন শিক্ষক যোগ করুন
        </button>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-semibold">
                <th className="p-3.5 w-12 text-center">ক্রম</th>
                <th className="p-3.5 w-16">ছবি</th>
                <th className="p-3.5">শিক্ষকের নাম</th>
                <th className="p-3.5">পদবী</th>
                <th className="p-3.5">বিষয়</th>
                <th className="p-3.5 text-center">ওয়েবসাইটে স্থিতি</th>
                <th className="p-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTeachers.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-3.5 text-center font-bold text-gray-400">
                    {t.displayOrder}
                  </td>
                  <td className="p-3.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                      {t.photoUrl ? (
                        <img
                          src={t.photoUrl}
                          alt={t.nameEn}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#1e3a5f] font-bold text-xs bg-amber-50">
                          {t.nameEn.slice(0, 1)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-gray-900">{t.nameBn || t.nameEn}</div>
                    <div className="text-[11px] text-gray-400">{t.nameEn}</div>
                  </td>
                  <td className="p-3.5 text-gray-700 font-medium">
                    {t.designationBn || t.designationEn}
                  </td>
                  <td className="p-3.5 text-gray-600">
                    {t.subjectBn || t.subjectEn || "—"}
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => togglePublish(t)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 transition-all ${
                        t.isPublished
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }`}
                    >
                      {t.isPublished ? (
                        <>
                          <CheckCircle size={11} /> প্রকাশিত
                        </>
                      ) : (
                        <>
                          <Clock size={11} /> অপ্রকাশিত
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => openEditModal(t)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="সম্পাদনা"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-[#1e3a5f] text-sm sm:text-base">
                {editingTeacher ? "শিক্ষক তথ্য সম্পাদনা করুন" : "নতুন শিক্ষক যোগ করুন"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              {/* Photo MediaPicker */}
              <MediaPicker
                value={photoUrl}
                onChange={setPhotoUrl}
                label="শিক্ষকের ছবি (Teacher Photo)"
                category="teachers"
                helpText="পাসপোর্ট সাইজ বা স্পষ্ট পোর্ট্রেট ছবি নির্বাচন করুন"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    শিক্ষকের নাম (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={nameBn}
                    onChange={(e) => setNameBn(e.target.value)}
                    placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    শিক্ষকের নাম (ইংরেজি) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Md. Rafiqul Islam"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    পদবী (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={designationBn}
                    onChange={(e) => setDesignationBn(e.target.value)}
                    placeholder="যেমন: সিনিয়র শিক্ষক / সহকারী শিক্ষক"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    পদবী (ইংরেজি)
                  </label>
                  <input
                    type="text"
                    value={designationEn}
                    onChange={(e) => setDesignationEn(e.target.value)}
                    placeholder="e.g. Senior Teacher"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    পাঠদানের বিষয় (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={subjectBn}
                    onChange={(e) => setSubjectBn(e.target.value)}
                    placeholder="যেমন: গণিত / বিজ্ঞান / ইংরেজি"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    পাঠদানের বিষয় (ইংরেজি)
                  </label>
                  <input
                    type="text"
                    value={subjectEn}
                    onChange={(e) => setSubjectEn(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  শিক্ষাগত যোগ্যতা
                </label>
                <input
                  type="text"
                  value={qualificationsBn}
                  onChange={(e) => setQualificationsBn(e.target.value)}
                  placeholder="যেমন: বি.এস.সি (সম্মান), এম.এস.সি, বি.এড"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  প্রদর্শন ক্রম (Display Order)
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-28 px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
