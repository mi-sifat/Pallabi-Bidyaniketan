"use client";

import { useState } from "react";
import {
  Megaphone,
  Plus,
  Trash2,
  CheckCircle,
  X,
  Loader2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";

interface PopupItem {
  id: string;
  titleBn?: string | null;
  titleEn?: string | null;
  descriptionBn?: string | null;
  imageUrl?: string | null;
  buttonTextBn?: string | null;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [titleBn, setTitleBn] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [buttonTextBn, setButtonTextBn] = useState("ভর্তি তথ্য ও ফরম দেখুন");
  const [buttonUrl, setButtonUrl] = useState("/bn/admission");
  const [isActive, setIsActive] = useState(true);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn) return alert("পপ-আপের শিরোনাম আবশ্যক");
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

      // If set active, update state
      if (isActive) {
        setPopups([
          data.popup,
          ...popups.map((p) => ({ ...p, isActive: false })),
        ]);
      } else {
        setPopups([data.popup, ...popups]);
      }

      setIsModalOpen(false);
      setTitleBn("");
      setDescriptionBn("");
      setImageUrl("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "সমস্যা হয়েছে";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (popup: PopupItem) => {
    const newActive = !popup.isActive;
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
      }
    } catch (err) {
      console.error("Toggle popup error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই পপ-আপ ঘোষণাটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/admin/announcement-popup?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPopups(popups.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Delete popup error:", err);
    }
  };

  const activePopup = popups.find((p) => p.isActive);

  return (
    <div className="space-y-6">
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
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-bold rounded-lg shadow-xs inline-flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
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
                : "border-gray-200 opacity-80 hover:opacity-100"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    popup.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {popup.isActive ? "সক্রিয় রয়েছে" : "নিষ্ক্রিয়"}
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(popup.createdAt).toLocaleDateString("bn-BD")}
                </span>
              </div>

              {popup.imageUrl && (
                <div className="h-36 rounded-xl overflow-hidden bg-gray-100 border">
                  <img
                    src={popup.imageUrl}
                    alt={popup.titleBn || "Popup"}
                    className="w-full h-full object-cover"
                  />
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

            <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => toggleActive(popup)}
                className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                  popup.isActive
                    ? "bg-amber-50 text-amber-800 hover:bg-amber-100"
                    : "bg-green-50 text-green-800 hover:bg-green-100"
                }`}
              >
                {popup.isActive ? "বন্ধ করুন" : "চালু করুন"}
              </button>

              <button
                type="button"
                onClick={() => handleDelete(popup.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="মুছে ফেলুন"
              >
                <Trash2 size={14} />
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-[#1e3a5f] text-sm sm:text-base">
                জরুরি ঘোষণা / ভর্তি বিজ্ঞপ্তি পপ-আপ তৈরি করুন
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              <MediaPicker
                value={imageUrl}
                onChange={setImageUrl}
                label="বিজ্ঞপ্তির ছবি / ব্যানার (ঐচ্ছিক)"
                category="popup"
                helpText="পপ-আপে আকর্ষণীয় ছবি বা নোটিশের পাতা যুক্ত করতে পারেন"
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
                <span className="font-semibold">তৈরির সাথে সাথেই ওয়েবসাইটে সক্রিয় করুন</span>
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
