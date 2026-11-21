"use client";

import { useState } from "react";
import {
  Sliders,
  Plus,
  Trash2,
  CheckCircle,
  X,
  Edit2,
  Loader2,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Eye,
} from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";

interface Slide {
  id: string;
  imageUrl: string;
  titleBn?: string | null;
  titleEn?: string | null;
  subtitleBn?: string | null;
  subtitleEn?: string | null;
  buttonTextBn?: string | null;
  buttonTextEn?: string | null;
  buttonUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export default function SliderManager({
  initialSlides,
}: {
  initialSlides: Slide[];
}) {
  const [slides, setSlides] = useState<Slide[]>(
    [...initialSlides].sort((a, b) => a.sortOrder - b.sortOrder)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [imageUrl, setImageUrl] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [subtitleBn, setSubtitleBn] = useState("");
  const [buttonTextBn, setButtonTextBn] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const openAddModal = () => {
    setEditingSlide(null);
    setImageUrl("");
    setTitleBn("");
    setTitleEn("");
    setSubtitleBn("");
    setButtonTextBn("বিস্তারিত জানুন");
    setButtonUrl("/bn/about");
    setSortOrder(slides.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (slide: Slide) => {
    setEditingSlide(slide);
    setImageUrl(slide.imageUrl);
    setTitleBn(slide.titleBn || "");
    setTitleEn(slide.titleEn || "");
    setSubtitleBn(slide.subtitleBn || "");
    setButtonTextBn(slide.buttonTextBn || "");
    setButtonUrl(slide.buttonUrl || "");
    setSortOrder(slide.sortOrder);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return showToast("error", "স্লাইডারের জন্য একটি ছবি নির্বাচন করুন");
    setSubmitting(true);

    const payload = {
      imageUrl,
      titleBn,
      titleEn: titleEn || titleBn,
      subtitleBn,
      subtitleEn: subtitleBn,
      buttonTextBn,
      buttonTextEn: buttonTextBn,
      buttonUrl,
      sortOrder: Number(sortOrder),
      isActive: editingSlide ? editingSlide.isActive : true,
    };

    try {
      if (editingSlide) {
        const res = await fetch(`/api/admin/homepage-slider/${editingSlide.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "আপডেট ব্যর্থ");
        setSlides(
          slides
            .map((s) => (s.id === editingSlide.id ? data.slide : s))
            .sort((a, b) => a.sortOrder - b.sortOrder)
        );
        showToast("success", "স্লাইডার সফলভাবে আপডেট হয়েছে");
      } else {
        const res = await fetch("/api/admin/homepage-slider", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "তৈরি ব্যর্থ");
        setSlides([...slides, data.slide].sort((a, b) => a.sortOrder - b.sortOrder));
        showToast("success", "নতুন স্লাইড তৈরি হয়েছে");
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "সমস্যা হয়েছে";
      showToast("error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (slide: Slide) => {
    const newStatus = !slide.isActive;
    setLoadingId(slide.id);
    try {
      const res = await fetch(`/api/admin/homepage-slider/${slide.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (res.ok) {
        setSlides(
          slides.map((s) => (s.id === slide.id ? { ...s, isActive: newStatus } : s))
        );
        showToast("success", newStatus ? "স্লাইডার সক্রিয় করা হয়েছে" : "স্লাইডার নিষ্ক্রিয় করা হয়েছে");
      }
    } catch (err) {
      showToast("error", "স্লাইডার স্ট্যাটাস পরিবর্তন ব্যর্থ");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/homepage-slider/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSlides(slides.filter((s) => s.id !== id));
        setDeleteConfirmId(null);
        showToast("success", "স্লাইডার মুছে ফেলা হয়েছে");
      }
    } catch (err) {
      showToast("error", "স্লাইডার মোছা যায়নি");
    } finally {
      setLoadingId(null);
    }
  };

  // Move Order Up or Down
  const handleMoveOrder = async (slide: Slide, direction: "up" | "down") => {
    const currentIndex = slides.findIndex((s) => s.id === slide.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const targetSlide = slides[targetIndex];
    setLoadingId(slide.id);

    try {
      // Swap sortOrders in DB
      const currentOrder = slide.sortOrder;
      const targetOrder = targetSlide.sortOrder;

      await Promise.all([
        fetch(`/api/admin/homepage-slider/${slide.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sortOrder: targetOrder }),
        }),
        fetch(`/api/admin/homepage-slider/${targetSlide.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sortOrder: currentOrder }),
        }),
      ]);

      const newSlides = [...slides];
      newSlides[currentIndex] = { ...slide, sortOrder: targetOrder };
      newSlides[targetIndex] = { ...targetSlide, sortOrder: currentOrder };

      setSlides(newSlides.sort((a, b) => a.sortOrder - b.sortOrder));
      showToast("success", "স্লাইডার ক্রম পরিবর্তন করা হয়েছে");
    } catch (err) {
      showToast("error", "ক্রম পরিবর্তন ব্যর্থ হয়েছে");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in ${
            toast.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <span>{toast.text}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h3 className="text-sm font-extrabold text-gray-800">
            মোট স্লাইডার: {slides.length} টি (সক্রিয়: {slides.filter((s) => s.isActive).length} টি)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            স্লাইডারগুলো ওয়েবসাইটের মূল পাতায় নির্ধারিত ক্রমানুসারে স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-bold rounded-lg shadow-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus size={16} /> নতুন স্লাইড যোগ করুন
        </button>
      </div>

      {/* Slides Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group ${
              slide.isActive ? "border-gray-200" : "border-gray-200 opacity-75"
            }`}
          >
            <div>
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src={slide.imageUrl}
                  alt={slide.titleBn || "Slide"}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-transparent p-4 flex flex-col justify-end text-white">
                  <h4 className="font-extrabold text-sm sm:text-base leading-snug">
                    {slide.titleBn || "শিরোনামহীন স্লাইড"}
                  </h4>
                  {slide.subtitleBn && (
                    <p className="text-xs text-gray-200 mt-1 line-clamp-1">
                      {slide.subtitleBn}
                    </p>
                  )}
                </div>
                <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                  ক্রম: {slide.sortOrder}
                </span>
                <span
                  className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs ${
                    slide.isActive ? "bg-green-600 text-white" : "bg-gray-600 text-white"
                  }`}
                >
                  {slide.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </span>
              </div>

              {slide.buttonUrl && (
                <div className="p-3 bg-gray-50 border-t border-gray-100 text-xs flex items-center justify-between text-gray-600">
                  <span>বাটন: <b>{slide.buttonTextBn || "বাটন"}</b></span>
                  <span className="text-[11px] text-gray-400 truncate max-w-[200px]">
                    {slide.buttonUrl}
                  </span>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="p-3.5 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={loadingId === slide.id}
                  onClick={() => toggleActive(slide)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    slide.isActive
                      ? "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                      : "bg-green-50 text-green-800 hover:bg-green-100 border border-green-200"
                  }`}
                >
                  {slide.isActive ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
                </button>

                {/* Move Order Up / Down */}
                <div className="inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5">
                  <button
                    type="button"
                    disabled={idx === 0 || loadingId === slide.id}
                    onClick={() => handleMoveOrder(slide, "up")}
                    className="p-1 text-gray-600 hover:text-[#1e3a5f] disabled:opacity-30 cursor-pointer"
                    title="উপরে নিন (Move Up)"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === slides.length - 1 || loadingId === slide.id}
                    onClick={() => handleMoveOrder(slide, "down")}
                    className="p-1 text-gray-600 hover:text-[#1e3a5f] disabled:opacity-30 cursor-pointer"
                    title="নিচে নিন (Move Down)"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEditModal(slide)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                  title="সম্পাদনা"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(slide.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {slides.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 space-y-2">
            <Sliders size={40} className="mx-auto text-gray-300" />
            <h4 className="font-bold text-gray-700 text-sm">কোনো স্লাইডার যুক্ত করা হয়নি</h4>
            <p className="text-xs">
              হোমপেজের শীর্ষে ব্যানার প্রদর্শনের জন্য নতুন স্লাইড যোগ করুন
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
                স্লাইডটি মুছে ফেলতে চান?
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                আপনি কি নিশ্চিতভাবে এই স্লাইডার ব্যানারটি মুছে ফেলতে চান?
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
                disabled={loadingId === deleteConfirmId}
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
              >
                {loadingId === deleteConfirmId && <Loader2 size={13} className="animate-spin" />}
                মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-[#1e3a5f] text-sm sm:text-base">
                {editingSlide ? "স্লাইডার সম্পাদনা করুন" : "নতুন স্লাইড তৈরি করুন"}
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
              <MediaPicker
                value={imageUrl}
                onChange={setImageUrl}
                label="স্লাইডারের ছবি (বাধ্যতামূলক) *"
                category="slider"
                helpText="হাই-রেজোলিউশন ল্যান্ডস্কেপ ছবি (যেমন: ১৯২০ x ৭২০ পিক্সেল) ব্যবহার করুন"
              />

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  প্রধান শিরোনাম (বাংলা)
                </label>
                <input
                  type="text"
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  placeholder="যেমন: পল্লবী বিদ্যানিকেতনে স্বাগতম"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  উপ-শিরোনাম বা সংক্ষিপ্ত বার্তা (বাংলা)
                </label>
                <input
                  type="text"
                  value={subtitleBn}
                  onChange={(e) => setSubtitleBn(e.target.value)}
                  placeholder="যেমন: মানসম্মত শিক্ষা ও নৈতিক চরিত্র গঠনের অঙ্গীকার"
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
                    placeholder="যেমন: ভর্তি তথ্য / জানুন"
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
                    placeholder="যেমন: /bn/admission অথবা /bn/about"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  প্রদর্শন ক্রম (Sort Order)
                </label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-24 px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
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
