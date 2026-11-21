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
  Eye,
  ArrowUp,
  ArrowDown,
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
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [imageUrl, setImageUrl] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [subtitleBn, setSubtitleBn] = useState("");
  const [buttonTextBn, setButtonTextBn] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

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
    if (!imageUrl) return alert("স্লাইডারের জন্য একটি ছবি নির্বাচন করুন");
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
      isActive: true,
    };

    try {
      if (editingSlide) {
        const res = await fetch(`/api/admin/homepage-slider/${editingSlide.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setSlides(slides.map((s) => (s.id === editingSlide.id ? data.slide : s)));
      } else {
        const res = await fetch("/api/admin/homepage-slider", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setSlides([...slides, data.slide]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save slide error:", err);
      alert("স্লাইডার সংরক্ষণ ব্যর্থ হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (slide: Slide) => {
    const newStatus = !slide.isActive;
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
      }
    } catch (err) {
      console.error("Toggle active error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই স্লাইডটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/admin/homepage-slider/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSlides(slides.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Delete slide error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <h3 className="text-xs font-bold text-gray-700">
            মোট সক্রিয় স্লাইডার: {slides.filter((s) => s.isActive).length} / {slides.length} টি
          </h3>
          <p className="text-[11px] text-gray-400">
            স্লাইডারগুলো ওয়েবসাইটের মূল পাতায় স্বয়ংক্রিয়ভাবে একটির পর একটি প্রদর্শিত হবে
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-bold rounded-lg shadow-xs inline-flex items-center gap-1.5"
        >
          <Plus size={16} /> নতুন স্লাইড যোগ করুন
        </button>
      </div>

      {/* Slides Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src={slide.imageUrl}
                  alt={slide.titleBn || "Slide"}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
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
                  className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs ${
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

            <div className="p-3.5 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => toggleActive(slide)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                  slide.isActive
                    ? "bg-amber-50 text-amber-800 hover:bg-amber-100"
                    : "bg-green-50 text-green-800 hover:bg-green-100"
                }`}
              >
                {slide.isActive ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEditModal(slide)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                  title="সম্পাদনা"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(slide.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
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
              হোমপেজের শীর্ষে আকর্ষণীয় ব্যানার প্রদর্শনের জন্য নতুন স্লাইড যোগ করুন
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
