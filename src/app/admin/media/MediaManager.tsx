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
  Filter,
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { key: "all", label: "সব ছবি" },
    { key: "general", label: "সাধারণ" },
    { key: "slider", label: "হোমপেজ স্লাইডার" },
    { key: "teachers", label: "শিক্ষক প্রোফাইল" },
    { key: "events", label: "অনুষ্ঠান ও ইভেন্ট" },
    { key: "gallery", label: "ফটো গ্যালারি" },
    { key: "popup", label: "ঘোষণা পপ-আপ" },
  ];

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
    } catch (err) {
      console.error("Upload error:", err);
      alert("ছবি আপলোড করার সময় সমস্যা হয়েছে");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ছবিটি মুছে ফেলতে চান?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
                    className="text-gray-500 hover:text-[#1e3a5f] p-1 text-[11px] inline-flex items-center gap-1"
                    title="লিংক কপি করুন"
                  >
                    {copiedId === item.id ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                    <span className="text-[10px]">{copiedId === item.id ? "কপি হয়েছে" : "লিংক"}</span>
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
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
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
    </div>
  );
}
