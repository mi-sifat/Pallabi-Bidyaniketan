"use client";

import { useState } from "react";
import {
  Newspaper,
  Plus,
  Trash2,
  Edit2,
  X,
  Loader2,
  ExternalLink,
  Calendar,
  ImageIcon,
} from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import Link from "next/link";

interface NewsTranslation {
  locale: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
}

interface NewsItem {
  id: string;
  slug: string;
  category?: string | null;
  coverImageUrl?: string | null;
  isPublished: boolean;
  createdAt: string | Date;
  translations: NewsTranslation[];
  album?: { id: string; titleBn: string | null } | null;
  event?: { id: string; titleBn: string | null } | null;
}

interface OptionItem {
  id: string;
  title: string;
}

export default function NewsManager({
  initialNews,
  albums,
  events,
}: {
  initialNews: NewsItem[];
  albums: OptionItem[];
  events: OptionItem[];
}) {
  const [newsList, setNewsList] = useState<NewsItem[]>(initialNews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [titleBn, setTitleBn] = useState("");
  const [category, setCategory] = useState("বিদ্যালয় সংবাদ");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [excerptBn, setExcerptBn] = useState("");
  const [contentBn, setContentBn] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const openCreateModal = () => {
    setTitleBn("");
    setCategory("বিদ্যালয় সংবাদ");
    setCoverImageUrl("");
    setExcerptBn("");
    setContentBn("");
    setSelectedAlbumId("");
    setSelectedEventId("");
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn) return alert("সংবাদের শিরোনাম আবশ্যক");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleBn,
          titleEn: titleBn,
          category,
          coverImageUrl: coverImageUrl || null,
          excerptBn,
          contentBn,
          albumId: selectedAlbumId || null,
          eventId: selectedEventId || null,
          isPublished,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "সংবাদ প্রকাশ ব্যর্থ হয়েছে");
      }

      setNewsList([data.news, ...newsList]);
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "সমস্যা হয়েছে";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const togglePublish = async (item: NewsItem) => {
    const newStatus = !item.isPublished;
    try {
      const res = await fetch(`/api/admin/news/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: newStatus }),
      });
      if (res.ok) {
        setNewsList(
          newsList.map((n) =>
            n.id === item.id ? { ...n, isPublished: newStatus } : n
          )
        );
      }
    } catch (err) {
      console.error("Toggle publish error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই সংবাদটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNewsList(newsList.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.error("Delete news error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <h3 className="text-xs font-bold text-gray-700">
            মোট সংবাদ ও ব্লগ: {newsList.length} টি
          </h3>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-bold rounded-lg shadow-xs inline-flex items-center gap-1.5"
        >
          <Plus size={16} /> নতুন সংবাদ লিখুন
        </button>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {newsList.map((item) => {
          const tr = item.translations.find((t) => t.locale === "bn") || item.translations[0];
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {item.coverImageUrl ? (
                  <div className="relative h-44 bg-gray-100 overflow-hidden">
                    <img
                      src={item.coverImageUrl}
                      alt={tr?.title || "News"}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 bg-[#1e3a5f]/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {item.category || "সংবাদ"}
                    </span>
                  </div>
                ) : (
                  <div className="h-28 bg-gray-50 flex items-center justify-center text-gray-300">
                    <Newspaper size={36} />
                  </div>
                )}

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(item.createdAt).toLocaleDateString("bn-BD")}
                    </span>
                    <button
                      type="button"
                      onClick={() => togglePublish(item)}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        item.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.isPublished ? "প্রকাশিত" : "ড্রাফট"}
                    </button>
                  </div>

                  <h4 className="font-bold text-gray-900 text-sm line-clamp-2">
                    {tr?.title}
                  </h4>

                  {tr?.excerpt && (
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {tr.excerpt}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between">
                <Link
                  href={`/bn/news/${item.slug}`}
                  target="_blank"
                  className="text-xs font-bold text-[#1e3a5f] hover:underline inline-flex items-center gap-1"
                >
                  <ExternalLink size={12} /> ওয়েবসাইটে দেখুন
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="মুছে ফেলুন"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {newsList.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 space-y-2">
            <Newspaper size={40} className="mx-auto text-gray-300" />
            <h4 className="font-bold text-gray-700 text-sm">কোনো সংবাদ প্রকাশ করা হয়নি</h4>
            <p className="text-xs">
              বিদ্যালয়ের নতুন কোনো অর্জন বা অনুষ্ঠান সম্পর্কে লিখতে উপরের বাটনে ক্লিক করুন
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-[#1e3a5f] text-sm sm:text-base">
                নতুন সংবাদ বা ব্লগ আর্টিকেল লিখুন
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
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  সংবাদের শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  placeholder="যেমন: পল্লবী বিদ্যানিকেতনে বার্ষিক ক্রীড়া উৎসব ২০২৪ সমাপ্ত"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  >
                    <option value="বিদ্যালয় সংবাদ">বিদ্যালয় সংবাদ (News)</option>
                    <option value="সাংস্কৃতিক ও ক্রীড়া">সাংস্কৃতিক ও ক্রীড়া (Events)</option>
                    <option value="জাতীয় দিবস">জাতীয় দিবস (National)</option>
                    <option value="শিক্ষা ও সহশিক্ষা">শিক্ষা ও সহশিক্ষা (Academic)</option>
                    <option value="অর্জন ও স্বীকৃতি">অর্জন ও স্বীকৃতি (Achievements)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ফটো অ্যালবাম যুক্ত করুন (ঐচ্ছিক)
                  </label>
                  <select
                    value={selectedAlbumId}
                    onChange={(e) => setSelectedAlbumId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  >
                    <option value="">কোনো অ্যালবাম নয়</option>
                    {albums.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ইভেন্ট যুক্ত করুন (ঐচ্ছিক)
                  </label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  >
                    <option value="">কোনো ইভেন্ট নয়</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cover Image */}
              <MediaPicker
                value={coverImageUrl}
                onChange={setCoverImageUrl}
                label="সংবাদের কভার ছবি (Cover Photo)"
                category="news"
                helpText="সংবাদের মূল আকর্ষণীয় ছবি নির্বাচন করুন"
              />

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  সংক্ষিপ্ত সারসংক্ষেপ (Excerpt)
                </label>
                <input
                  type="text"
                  value={excerptBn}
                  onChange={(e) => setExcerptBn(e.target.value)}
                  placeholder="১-২ বাক্যে সংবাদের মূল কথা..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  সম্পূর্ণ সংবাদের বিবরণ (Content)
                </label>
                <textarea
                  rows={6}
                  value={contentBn}
                  onChange={(e) => setContentBn(e.target.value)}
                  placeholder="অনুষ্ঠানের বিস্তারিত বিবরণ, প্রধান অতিথির বক্তব্য, বিজয়ীদের তালিকা ইত্যাদি..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
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
                  সংবাদ প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
