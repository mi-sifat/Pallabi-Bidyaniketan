"use client";

import { useState } from "react";
import {
  Megaphone,
  Plus,
  Trash2,
  Edit3,
  Eye,
  CheckCircle,
  X,
  Loader2,
  Calendar,
  AlertCircle,
  ImageOff,
  ExternalLink,
} from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";

interface PopupItem {
  id: string;
  titleBn?: string | null;
  titleEn?: string | null;
  descriptionBn?: string | null;
  descriptionEn?: string | null;
  imageUrl?: string | null;
  buttonTextBn?: string | null;
  buttonTextEn?: string | null;
  buttonUrl?: string | null;
  isActive: boolean;
  createdAt: string | Date;
}

export default function PopupManager({
  initialPopups,
}: {
  initialPopups: PopupItem[];
}) {
  const [popups, setPopups] = useState<PopupItem[]>(initialPopups);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<PopupItem | null>(null);
  const [previewPopup, setPreviewPopup] = useState<PopupItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states for Create/Edit
  const [titleBn, setTitleBn] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [buttonTextBn, setButtonTextBn] = useState("ভর্তি তথ্য ও ফরম দেখুন");
  const [buttonUrl, setButtonUrl] = useState("/bn/admission");
  const [isActive, setIsActive] = useState(true);

  const showFeedback = (type: "success" | "error", text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const openCreateModal = () => {
    setTitleBn("");
    setTitleEn("");
    setDescriptionBn("");
    setImageUrl("");
    setButtonTextBn("ভর্তি তথ্য ও ফরম দেখুন");
    setButtonUrl("/bn/admission");
    setIsActive(true);
    setIsCreateOpen(true);
  };

  const openEditModal = (p: PopupItem) => {
    setEditingPopup(p);
    setTitleBn(p.titleBn || "");
    setTitleEn(p.titleEn || "");
    setDescriptionBn(p.descriptionBn || "");
    setImageUrl(p.imageUrl || "");
    setButtonTextBn(p.buttonTextBn || "ভর্তি তথ্য ও ফরম দেখুন");
    setButtonUrl(p.buttonUrl || "/bn/admission");
    setIsActive(p.isActive);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn) return showFeedback("error", "পপ-আপের শিরোনাম আবশ্যক");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/announcement-popup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleBn,
          titleEn: titleEn || titleBn,
          descriptionBn,
          imageUrl: imageUrl || null,
          buttonTextBn,
          buttonUrl,
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "সংরক্ষণ ব্যর্থ হয়েছে");
      }

      if (isActive) {
        setPopups([data.popup, ...popups.map((p) => ({ ...p, isActive: false }))]);
      } else {
        setPopups([data.popup, ...popups]);
      }

      setIsCreateOpen(false);
      showFeedback("success", "নতুন পপ-আপ সফলভাবে তৈরি হয়েছে");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "সমস্যা হয়েছে";
      showFeedback("error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPopup) return;
    if (!titleBn) return showFeedback("error", "পপ-আপের শিরোনাম আবশ্যক");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/announcement-popup", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingPopup.id,
          titleBn,
          titleEn: titleEn || titleBn,
          descriptionBn,
          imageUrl: imageUrl === "" ? null : imageUrl,
          buttonTextBn,
          buttonUrl,
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "আপডেট ব্যর্থ হয়েছে");
      }

      setPopups(
        popups.map((p) => {
          if (p.id === editingPopup.id) return data.popup;
          if (isActive) return { ...p, isActive: false };
          return p;
        })
      );

      setEditingPopup(null);
      showFeedback("success", "পপ-আপের তথ্য সফলভাবে আপডেট হয়েছে");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "আপডেট সমস্যা হয়েছে";
      showFeedback("error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Direct Remove Image from Popup (does NOT delete media from library)
  const handleRemoveImageFromPopup = async (popupId: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই পপ-আপ থেকে ছবিটি সরিয়ে ফেলতে চান?\n(মূল মিডিয়া লাইব্রেরির ফাইল অক্ষত থাকবে)")) {
      return;
    }

    setLoadingActionId(popupId);
    try {
      const res = await fetch("/api/admin/announcement-popup", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: popupId, action: "remove_image" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "ছবি সরানো যায়নি");
      }

      setPopups(
        popups.map((p) => (p.id === popupId ? { ...p, imageUrl: null } : p))
      );
      if (editingPopup && editingPopup.id === popupId) {
        setImageUrl("");
        setEditingPopup({ ...editingPopup, imageUrl: null });
      }

      showFeedback("success", "পপ-আপ থেকে ছবি সফলভাবে সরানো হয়েছে");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "সমস্যা হয়েছে";
      showFeedback("error", msg);
    } finally {
      setLoadingActionId(null);
    }
  };

  const toggleActive = async (popup: PopupItem) => {
    const newActive = !popup.isActive;
    setLoadingActionId(popup.id);
    try {
      const res = await fetch("/api/admin/announcement-popup", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: popup.id, isActive: newActive }),
      });
      if (res.ok) {
        setPopups(
          popups.map((p) => {
            if (p.id === popup.id) return { ...p, isActive: newActive };
            if (newActive) return { ...p, isActive: false };
            return p;
          })
        );
        showFeedback("success", newActive ? "পপ-আপ সক্রিয় করা হয়েছে" : "পপ-আপ নিষ্ক্রিয় করা হয়েছে");
      }
    } catch (err) {
      showFeedback("error", "পপ-আপ স্থিতি পরিবর্তন করা যায়নি");
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setLoadingActionId(id);
    try {
      const res = await fetch(`/api/admin/announcement-popup?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPopups(popups.filter((p) => p.id !== id));
        setDeleteConfirmId(null);
        showFeedback("success", "পপ-আপ ঘোষণা সফলভাবে মুছে ফেলা হয়েছে");
      } else {
        throw new Error("ডিলিট ব্যর্থ হয়েছে");
      }
    } catch (err) {
      showFeedback("error", "পপ-আপ মোছা যায়নি");
    } finally {
      setLoadingActionId(null);
    }
  };

  const activePopup = popups.find((p) => p.isActive);

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in duration-200 ${
            feedbackMsg.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button type="button" onClick={() => setFeedbackMsg(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Current Active Status Banner */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              activePopup
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <Megaphone size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-800">
                ওয়েবসাইট পপ-আপ স্থিতি:
              </span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  activePopup
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {activePopup ? "বর্তমানে সক্রিয়" : "কোনো পপ-আপ সক্রিয় নেই"}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {activePopup
                ? `সক্রিয় ঘোষণা: "${activePopup.titleBn}"`
                : "নতুন দর্শনার্থীদের জরুরি নোটিশ বা ভর্তি তথ্য দেখানোর জন্য পপ-আপ চালু করুন"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-bold rounded-lg shadow-xs inline-flex items-center gap-1.5 self-stretch sm:self-auto justify-center cursor-pointer transition-colors"
        >
          <Plus size={16} /> নতুন পপ-আপ ঘোষণা তৈরি করুন
        </button>
      </div>

      {/* Popups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {popups.map((popup) => (
          <div
            key={popup.id}
            className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
              popup.isActive
                ? "border-green-400 ring-2 ring-green-100"
                : "border-gray-200 opacity-90 hover:opacity-100"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    popup.isActive
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {popup.isActive ? "সক্রিয় রয়েছে" : "নিষ্ক্রিয়"}
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(popup.createdAt).toLocaleDateString("bn-BD")}
                </span>
              </div>

              {/* Popup Image Display with Direct Remove Button */}
              {popup.imageUrl ? (
                <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={popup.imageUrl}
                      alt={popup.titleBn || "Popup"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2 bg-gray-50/90 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 font-medium truncate max-w-[200px]">
                      ছবি যুক্ত আছে
                    </span>
                    <button
                      type="button"
                      disabled={loadingActionId === popup.id}
                      onClick={() => handleRemoveImageFromPopup(popup.id)}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-md inline-flex items-center gap-1 transition-colors cursor-pointer"
                      title="পপ-আপ থেকে শুধু ছবিটি সরিয়ে ফেলুন (মূল ফাইল লাইব্রেরিতে থাকবে)"
                    >
                      {loadingActionId === popup.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <ImageOff size={12} />
                      )}
                      ছবি সরিয়ে ফেলুন
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center text-gray-400 text-xs">
                  কোনো ছবি যুক্ত নেই (শুধু টেক্সট নোটিশ)
                </div>
              )}

              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  {popup.titleBn}
                </h4>
                {popup.descriptionBn && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-3 leading-relaxed">
                    {popup.descriptionBn}
                  </p>
                )}
              </div>

              {popup.buttonUrl && (
                <div className="p-2.5 bg-gray-50 rounded-lg text-xs text-gray-600 flex items-center justify-between">
                  <span>বাটন: <b>{popup.buttonTextBn}</b></span>
                  <span className="text-[11px] text-gray-400 truncate max-w-[150px]">
                    {popup.buttonUrl}
                  </span>
                </div>
              )}
            </div>

            {/* Actions Toolbar */}
            <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={loadingActionId === popup.id}
                  onClick={() => toggleActive(popup)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    popup.isActive
                      ? "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                      : "bg-green-50 text-green-800 hover:bg-green-100 border border-green-200"
                  }`}
                >
                  {popup.isActive ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(popup)}
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
                  title="সম্পাদনা করুন"
                >
                  <Edit3 size={13} />
                  সম্পাদনা
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewPopup(popup)}
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
                  title="প্রিভিউ দেখুন"
                >
                  <Eye size={13} />
                  প্রিভিউ
                </button>
              </div>

              <button
                type="button"
                onClick={() => setDeleteConfirmId(popup.id)}
                className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                title="পপ-আপ মুছে ফেলুন"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {popups.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 space-y-2">
            <Megaphone size={40} className="mx-auto text-gray-300" />
            <h4 className="font-bold text-gray-700 text-sm">কোনো পপ-আপ তৈরি করা হয়নি</h4>
            <p className="text-xs">
              ভর্তি বিজ্ঞপ্তি বা জরুরি বার্তা ওয়েবসাইটে প্রদর্শন করতে উপরের বাটনে ক্লিক করুন
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                পপ-আপটি মুছে ফেলতে চান?
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                আপনি কি নিশ্চিতভাবে এই পপ-আপ ঘোষণাটি মুছে ফেলতে চান? এই কাজটি আর Undo করা যাবে না।
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                বাতিল
              </button>
              <button
                type="button"
                disabled={loadingActionId === deleteConfirmId}
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
              >
                {loadingActionId === deleteConfirmId && <Loader2 size={13} className="animate-spin" />}
                মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(isCreateOpen || editingPopup) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-[#1e3a5f] text-sm sm:text-base">
                {editingPopup ? "পপ-আপ ঘোষণা সম্পাদনা করুন" : "জরুরি ঘোষণা / ভর্তি বিজ্ঞপ্তি পপ-আপ তৈরি করুন"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingPopup(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={editingPopup ? handleUpdate : handleCreate}
              className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm"
            >
              <MediaPicker
                value={imageUrl}
                onChange={setImageUrl}
                label="বিজ্ঞপ্তির ছবি / ব্যানার (ঐচ্ছিক)"
                category="popup"
                helpText="পপ-আপে ছবি যুক্ত করতে পারেন অথবা বিদ্যমান ছবি পরিবর্তন/সরিয়ে নিতে পারেন"
              />

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  বিজ্ঞপ্তির শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  placeholder="যেমন: ২০২৫ শিক্ষাবর্ষে ভর্তি চলছে!"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  বিস্তারিত বিবরণ
                </label>
                <textarea
                  rows={3}
                  value={descriptionBn}
                  onChange={(e) => setDescriptionBn(e.target.value)}
                  placeholder="বিজ্ঞপ্তির মূল বিষয়বস্তু ও অভিভাবকদের জন্য প্রয়োজনীয় নির্দেশনা..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    অ্যাকশন বাটন টেক্সট
                  </label>
                  <input
                    type="text"
                    value={buttonTextBn}
                    onChange={(e) => setButtonTextBn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    বাটন লিংক (URL)
                  </label>
                  <input
                    type="text"
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                <span className="font-semibold">ওয়েবসাইটে সক্রিয় রাখুন</span>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#1e3a5f] rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingPopup(null);
                  }}
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
                  {editingPopup ? "পরিবর্তন সংরক্ষণ করুন" : "সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <button
              type="button"
              onClick={() => setPreviewPopup(null)}
              className="absolute top-3 right-3 z-20 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="p-2 bg-amber-100 text-amber-900 text-center text-[10px] font-bold">
              [লাইভ প্রিভিউ — হোমপেজে যেভাবে প্রদর্শিত হবে]
            </div>

            {previewPopup.imageUrl ? (
              <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                <img
                  src={previewPopup.imageUrl}
                  alt={previewPopup.titleBn || "Notice"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 bg-[#c9a84c] text-[#1e3a5f] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                  <Megaphone size={12} />
                  জরুরি বিজ্ঞপ্তি
                </div>
              </div>
            ) : (
              <div className="bg-[#1e3a5f] p-5 text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c9a84c] text-[#1e3a5f] flex items-center justify-center shrink-0">
                  <Megaphone size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">
                    গুরুত্বপূর্ণ ঘোষণা
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base leading-snug">
                    {previewPopup.titleBn}
                  </h3>
                </div>
              </div>
            )}

            <div className="p-6 space-y-4">
              {previewPopup.imageUrl && (
                <h3 className="font-extrabold text-[#1e3a5f] text-base leading-snug">
                  {previewPopup.titleBn}
                </h3>
              )}

              {previewPopup.descriptionBn && (
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {previewPopup.descriptionBn}
                </p>
              )}

              <div className="pt-2 flex items-center gap-2">
                {previewPopup.buttonUrl && (
                  <button
                    type="button"
                    className="flex-1 py-2.5 px-4 bg-[#1e3a5f] text-white text-xs font-bold rounded-xl shadow-xs text-center inline-flex items-center justify-center gap-1.5"
                  >
                    <span>{previewPopup.buttonTextBn || "বিস্তারিত দেখুন"}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPreviewPopup(null)}
                  className="py-2.5 px-4 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl"
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
