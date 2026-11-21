"use client";

import { useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Search,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  Edit,
  AlertTriangle,
  X,
  Info,
} from "lucide-react";
import { formatFileSize } from "@/lib/utils";

interface MediaItem {
  id: string;
  url: string;
  originalName: string;
  caption: string | null;
  altText: string | null;
  category: string | null;
  size: number;
  mimeType: string;
  createdAt: string | Date;
}

export default function MediaManager({
  initialMedia,
}: {
  initialMedia: MediaItem[];
}) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [inUseWarning, setInUseWarning] = useState<{ id: string; message: string; places: string[] } | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { key: "all", label: "সব ছবি" },
    { key: "general", label: "সাধারণ" },
    { key: "gallery", label: "ফটো গ্যালারি" },
    { key: "slider", label: "হোমপেজ স্লাইডার" },
    { key: "teachers", label: "শিক্ষক প্রোফাইল" },
    { key: "events", label: "অনুষ্ঠান ও ইভেন্ট" },
    { key: "popup", label: "ঘোষণা পপ-আপ" },
  ];

  const showToast = (type: "success" | "error", text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const filteredMedia = mediaList.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesQuery =
      !searchQuery ||
      (item.originalName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.caption?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", selectedCategory === "all" ? "general" : selectedCategory);
        formData.append("caption", file.name.replace(/\.[^/.]+$/, ""));

        const res = await fetch("/api/admin/media", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.media) {
          setMediaList((prev) => [data.media, ...prev]);
        }
      }
      showToast("success", "ছবি সফলভাবে লাইব্রেরিতে আপলোড করা হয়েছে");
    } catch (err) {
      console.error("Upload error:", err);
      showToast("error", "ছবি আপলোড করার সময় সমস্যা হয়েছে");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, force: boolean = false) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/media?id=${id}${force ? "&force=true" : ""}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.status === 409 && data.inUse) {
        setInUseWarning({
          id,
          message: data.error,
          places: data.places || [],
        });
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "মুছে ফেলা যায়নি");
      }

      setMediaList((prev) => prev.filter((m) => m.id !== id));
      setInUseWarning(null);
      showToast("success", "ছবি সফলভাবে মুছে ফেলা হয়েছে");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "সমস্যা হয়েছে";
      showToast("error", msg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openEditModal = (item: MediaItem) => {
    setEditItem(item);
    setEditCaption(item.caption || item.originalName || "");
    setEditCategory(item.category || "general");
  };

  const handleSaveEdit = async () => {
    if (!editItem) return;
    try {
      const res = await fetch("/api/admin/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editItem.id,
          caption: editCaption,
          altText: editCaption,
          category: editCategory,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "আপডেট ব্যর্থ");

      setMediaList((prev) =>
        prev.map((m) =>
          m.id === editItem.id
            ? { ...m, caption: editCaption, category: editCategory }
            : m
        )
      );
      setEditItem(null);
      showToast("success", "ছবির বিবরণ আপডেট করা হয়েছে");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "সমস্যা হয়েছে";
      showToast("error", msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${
            feedback.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <span>{feedback.text}</span>
          <button type="button" onClick={() => setFeedback(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleUploadFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-[#1e3a5f] bg-blue-50/50 scale-[0.99]"
            : "border-gray-300 hover:border-[#1e3a5f] bg-white hover:bg-gray-50/50"
        } shadow-sm`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUploadFiles(e.target.files)}
        />
        <div className="w-14 h-14 bg-amber-50 text-[#1e3a5f] rounded-full shadow-sm flex items-center justify-center mx-auto mb-3">
          {uploading ? (
            <Loader2 size={26} className="animate-spin text-[#1e3a5f]" />
          ) : (
            <Upload size={26} className="text-[#1e3a5f]" />
          )}
        </div>
        <h3 className="text-sm sm:text-base font-bold text-gray-800">
          {uploading ? "ছবি আপলোড হচ্ছে..." : "নতুন ছবি আপলোড করতে এখানে ক্লিক করুন অথবা টেনে এনে ছেড়ে দিন"}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          একসাথে একাধিক ছবি নির্বাচন করতে পারেন (JPG, PNG, WebP — প্রতি ফাইল সর্বোচ্চ ১০MB)
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.key
                  ? "bg-[#1e3a5f] text-white shadow-xs"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ছবির নাম বা ক্যাপশন দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#1e3a5f] outline-none"
          />
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.caption || item.originalName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <span className="absolute top-2 left-2 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                  {formatFileSize(item.size)}
                </span>
              </div>

              <div className="p-3 space-y-1.5 text-xs">
                <p className="font-semibold text-gray-800 truncate" title={item.caption || item.originalName}>
                  {item.caption || item.originalName}
                </p>
                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <span className="capitalize">{item.category || "সাধারণ"}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString("bn-BD")}</span>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.url, item.id)}
                    className="text-gray-500 hover:text-[#1e3a5f] p-1 text-[11px] inline-flex items-center gap-1 cursor-pointer"
                    title="লিংক কপি করুন"
                  >
                    {copiedId === item.id ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                    <span className="text-[10px]">{copiedId === item.id ? "কপি হয়েছে" : "লিংক"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="text-gray-500 hover:text-[#1e3a5f] p-1 cursor-pointer"
                    title="সম্পাদনা করুন"
                  >
                    <Edit size={13} />
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-[#1e3a5f] p-1"
                    title="পূর্ণ সাইজে দেখুন"
                  >
                    <ExternalLink size={13} />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, false)}
                    disabled={deletingId === item.id}
                    className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    {deletingId === item.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 space-y-2">
          <ImageIcon size={40} className="mx-auto text-gray-300" />
          <h3 className="font-bold text-gray-700 text-sm">কোনো ছবি পাওয়া যায়নি</h3>
          <p className="text-xs">
            উপরের বক্সে ক্লিক করে আপনার কম্পিউটার থেকে ছবি আপলোড করুন
          </p>
        </div>
      )}

      {/* In-Use Deletion Warning Modal */}
      {inUseWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 max-w-md w-full space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                ছবিটি বর্তমানে ব্যবহৃত হচ্ছে
              </h3>
              <p className="text-xs text-gray-600 mt-2">
                এই ছবিটি ওয়েবসাইটের নিম্নলিখিত স্থানে সংযুক্ত আছে:
              </p>
              <div className="mt-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-left font-medium space-y-1">
                {inUseWarning.places.map((place, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span>•</span>
                    <span>{place}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 mt-3">
                নিরাপত্তার স্বার্থে, প্রথমে সংশ্লিষ্ট সেকশন থেকে ছবিটি পরিবর্তন করুন অথবা আপনি যদি নিশ্চিত হন তবেই এটি স্থায়ীভাবে মুছুন।
              </p>
            </div>
            <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setInUseWarning(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={() => handleDelete(inUseWarning.id, true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                বাধ্যতামূলক ডিলিট করুন (Force Delete)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Media Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-[#1e3a5f] text-sm">ছবির বিবরণ সম্পাদনা</h3>
              <button type="button" onClick={() => setEditItem(null)}>
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            <div className="h-32 rounded-xl overflow-hidden bg-gray-50 border">
              <img src={editItem.url} alt="Preview" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ক্যাপশন / শিরোনাম
                </label>
                <input
                  type="text"
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ক্যাটাগরি
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                >
                  <option value="general">সাধারণ</option>
                  <option value="gallery">ফটো গ্যালারি</option>
                  <option value="slider">হোমপেজ স্লাইডার</option>
                  <option value="teachers">শিক্ষক প্রোফাইল</option>
                  <option value="events">অনুষ্ঠান ও ইভেন্ট</option>
                  <option value="popup">ঘোষণা পপ-আপ</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-lg text-xs font-bold"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
