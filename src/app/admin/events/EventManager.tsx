"use client";

import { useState } from "react";
import {
  Calendar,
  Plus,
  Trash2,
  MapPin,
  ImageIcon,
  Loader2,
  CheckCircle,
  X,
  ExternalLink,
} from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";

interface EventItem {
  id: string;
  slug: string;
  titleBn: string | null;
  titleEn: string;
  category: string | null;
  eventDate: string | Date | null;
  location: string | null;
  descriptionBn: string | null;
  descriptionEn: string | null;
  coverImageUrl: string | null;
  albumId: string | null;
  isPublished: boolean;
  album?: {
    id: string;
    slug: string;
    images: { id: string; imageUrl: string }[];
  } | null;
}

export default function EventManager({
  initialEvents,
}: {
  initialEvents: EventItem[];
}) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [titleBn, setTitleBn] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [category, setCategory] = useState("সাংস্কৃতিক অনুষ্ঠান");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("বিদ্যালয় প্রাঙ্গণ, মিরপুর-৭");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);

  const handleAddAdditionalPhoto = (url: string) => {
    if (url && !additionalPhotos.includes(url)) {
      setAdditionalPhotos([...additionalPhotos, url]);
    }
  };

  const handleRemoveAdditionalPhoto = (index: number) => {
    setAdditionalPhotos(additionalPhotos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn) return alert("অনুষ্ঠানের নাম আবশ্যক");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleBn,
          titleEn: titleEn || titleBn,
          category,
          eventDate,
          location,
          descriptionBn,
          descriptionEn: descriptionBn,
          coverImageUrl: coverImageUrl || null,
          additionalPhotos,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "ইভেন্ট সংরক্ষণ ব্যর্থ হয়েছে");
      }

      setEvents([data.event, ...events]);
      setIsAddOpen(false);
      // Reset form
      setTitleBn("");
      setTitleEn("");
      setCoverImageUrl("");
      setAdditionalPhotos([]);
      setDescriptionBn("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "সমস্যা হয়েছে";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ইভেন্টটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents(events.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error("Delete event error:", err);
    }
  };

  const togglePublish = async (ev: EventItem) => {
    const newStatus = !ev.isPublished;
    try {
      const res = await fetch(`/api/admin/events/${ev.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: newStatus }),
      });
      if (res.ok) {
        setEvents(
          events.map((e) => (e.id === ev.id ? { ...e, isPublished: newStatus } : e))
        );
      }
    } catch (err) {
      console.error("Toggle publish error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-bold rounded-lg shadow-xs inline-flex items-center gap-2"
        >
          <Plus size={16} /> নতুন ইভেন্ট যোগ করুন
        </button>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-[#1e3a5f] text-sm sm:text-base">
                নতুন ইভেন্ট বা অনুষ্ঠান যোগ করুন
              </h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    অনুষ্ঠানের নাম (বাংলা) *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    placeholder="যেমন: মহান বিজয় দিবস উদযাপন"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  >
                    <option value="সাংস্কৃতিক অনুষ্ঠান">সাংস্কৃতিক অনুষ্ঠান (Cultural)</option>
                    <option value="ক্রীড়া ও অ্যাথলেটিকস">ক্রীড়া ও অ্যাথলেটিকস (Sports)</option>
                    <option value="জাতীয় দিবস">জাতীয় দিবস (National Day)</option>
                    <option value="শিক্ষা সফর">শিক্ষা সফর (Study Tour)</option>
                    <option value="বিজ্ঞান মেলা">বিজ্ঞান মেলা (Science Fair)</option>
                    <option value="অভিভাবক সমাবেশ">অভিভাবক সমাবেশ (Meeting)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    অনুষ্ঠানের তারিখ
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    স্থান (Location)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="বিদ্যালয় প্রাঙ্গণ, মিল্কভিটা রোড, মিরপুর-৭"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  />
                </div>
              </div>

              {/* Cover Image Picker */}
              <MediaPicker
                value={coverImageUrl}
                onChange={setCoverImageUrl}
                label="ইভেন্ট কভার ছবি (Cover Photo)"
                category="events"
                helpText="অনুষ্ঠানের মূল কভার ছবি নির্বাচন বা আপলোড করুন"
              />

              {/* Multiple Additional Photos */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-xs font-bold text-gray-800">
                  অতিরিক্ত ছবিসমূহ (স্বয়ংক্রিয় ফটো গ্যালারি অ্যালবাম তৈরি হবে)
                </label>
                {additionalPhotos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {additionalPhotos.map((url, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden h-16 border bg-white">
                        <img src={url} alt={`Photo ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveAdditionalPhoto(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <MediaPicker
                  value=""
                  onChange={handleAddAdditionalPhoto}
                  label=""
                  category="events"
                  helpText="ছবি যোগ করতে ক্লিক করুন (একাধিক ছবি যুক্ত করা যাবে)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  অনুষ্ঠানের বিবরণ (Description)
                </label>
                <textarea
                  rows={3}
                  value={descriptionBn}
                  onChange={(e) => setDescriptionBn(e.target.value)}
                  placeholder="অনুষ্ঠানের কার্যক্রম ও আয়োজনের সার্বিক বিবরণ..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
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
                  ইভেন্ট ও অ্যালবাম সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events List Grid */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {ev.coverImageUrl ? (
                  <div className="relative h-40 bg-gray-100 overflow-hidden">
                    <img
                      src={ev.coverImageUrl}
                      alt={ev.titleBn || ev.titleEn}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 bg-[#1e3a5f]/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {ev.category}
                    </span>
                  </div>
                ) : (
                  <div className="h-28 bg-blue-50 flex items-center justify-center text-blue-300">
                    <Calendar size={32} />
                  </div>
                )}

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-[#c9a84c]" />
                      {ev.eventDate
                        ? new Date(ev.eventDate).toLocaleDateString("bn-BD")
                        : "তারিখ নির্ধারিত হয়নি"}
                    </span>
                    <button
                      type="button"
                      onClick={() => togglePublish(ev)}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        ev.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {ev.isPublished ? "প্রকাশিত" : "ড্রাফট"}
                    </button>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm line-clamp-1">
                    {ev.titleBn || ev.titleEn}
                  </h3>

                  {ev.location && (
                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                      <MapPin size={11} className="text-gray-400 shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </p>
                  )}

                  {ev.descriptionBn && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {ev.descriptionBn}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                {ev.album ? (
                  <span className="text-[11px] font-semibold text-[#1e3a5f] inline-flex items-center gap-1">
                    <ImageIcon size={12} />
                    {ev.album.images?.length || 0} টি ছবি সংযুক্ত
                  </span>
                ) : (
                  <span className="text-[11px] text-gray-400">কোনো ছবি নেই</span>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(ev.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="মুছে ফেলুন"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 space-y-2">
          <Calendar size={40} className="mx-auto text-gray-300" />
          <h3 className="font-bold text-gray-700 text-sm">কোনো ইভেন্ট যুক্ত করা হয়নি</h3>
          <p className="text-xs">
            নতুন ইভেন্ট যোগ করতে উপরের বাটনে ক্লিক করুন
          </p>
        </div>
      )}
    </div>
  );
}
