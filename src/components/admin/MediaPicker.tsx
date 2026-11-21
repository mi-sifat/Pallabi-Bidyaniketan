"use client";

import { useState, useEffect, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Check,
  X,
  Search,
  Loader2,
  FolderOpen,
  Eye,
} from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  originalName: string;
  caption?: string | null;
  category?: string | null;
  size: number;
  createdAt: string;
}

interface MediaPickerProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  category?: string;
  helpText?: string;
}

export default function MediaPicker({
  value,
  onChange,
  label = "ছবি নির্বাচন করুন",
  category = "general",
  helpText = "কম্পিউটার থেকে নতুন ছবি আপলোড করুন অথবা পূর্বে আপলোডকৃত ছবি থেকে সিলেক্ট করুন",
}: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "existing">("upload");
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Upload preview
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [captionInput, setCaptionInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && activeTab === "existing") {
      fetchExistingMedia();
    }
  }, [isOpen, activeTab]);

  const fetchExistingMedia = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/media?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.media)) {
        setMediaList(data.media);
      }
    } catch (err) {
      console.error("Failed to load media:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCaptionInput(file.name.replace(/\.[^/.]+$/, ""));
      setUploadError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setPreviewFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCaptionInput(file.name.replace(/\.[^/.]+$/, ""));
      setUploadError(null);
    }
  };

  const handleUploadSubmit = async () => {
    if (!previewFile) return;
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", previewFile);
    formData.append("caption", captionInput);
    formData.append("category", category);
    formData.append("folder", category || "media");

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "আপলোড ব্যর্থ হয়েছে");
      }
      onChange(data.url);
      setIsOpen(false);
      setPreviewFile(null);
      setPreviewUrl(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "ছবি আপলোড করা যায়নি";
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-semibold text-gray-700">{label}</label>}

      {/* Selected Image Display */}
      <div className="flex flex-wrap items-center gap-3">
        {value ? (
          <div className="relative group w-24 h-24 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 shrink-0 shadow-sm">
            <img src={value} alt="Selected" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition-all cursor-pointer"
              title="ছবি সরিয়ে ফেলুন"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 shrink-0">
            <ImageIcon size={24} className="mb-1 text-gray-300" />
            <span className="text-[10px]">কোনো ছবি নেই</span>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                setPreviewFile(null);
                setPreviewUrl(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <FolderOpen size={14} />
              {value ? "ছবি পরিবর্তন করুন" : "ছবি যুক্ত করুন"}
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg border border-red-200 transition-all cursor-pointer"
                title="এই সেকশন থেকে ছবিটি সরিয়ে ফেলুন"
              >
                <X size={13} />
                ছবি সরিয়ে ফেলুন
              </button>
            )}
          </div>
          {helpText && <p className="text-[11px] text-gray-500">{helpText}</p>}
        </div>
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="font-bold text-[#1e3a5f] text-sm sm:text-base">
                  মিডিয়া পিকার (ছবি নির্বাচন বা আপলোড)
                </h3>
                <p className="text-[11px] text-gray-500">
                  সহজে ছবি আপলোড করুন অথবা পূর্বে সংরক্ষিত ছবি থেকে বেছে নিন
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 bg-white px-6">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                  activeTab === "upload"
                    ? "border-[#1e3a5f] text-[#1e3a5f]"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <Upload size={14} />
                নতুন ছবি আপলোড (Upload New)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("existing")}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                  activeTab === "existing"
                    ? "border-[#1e3a5f] text-[#1e3a5f]"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <FolderOpen size={14} />
                পূর্বে আপলোডকৃত ছবি (Select Existing)
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-1 overflow-y-auto">
              {activeTab === "upload" ? (
                <div className="space-y-4">
                  {/* Drag and Drop Zone */}
                  {!previewUrl ? (
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 hover:border-[#1e3a5f] bg-gray-50/50 hover:bg-blue-50/20 rounded-2xl p-8 text-center cursor-pointer transition-all"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 text-[#1e3a5f]">
                        <Upload size={22} />
                      </div>
                      <p className="text-xs font-bold text-gray-800">
                        ছবি টেনে এনে এখানে ফেলুন (Drag & Drop) অথবা ক্লিক করে ফাইল নির্বাচন করুন
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        সমর্থিত ফরম্যাট: JPG, PNG, WebP (সর্বোচ্চ ১০ মেগাবাইট)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                        <div className="w-36 h-36 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0">
                          <img
                            src={previewUrl}
                            alt="Upload preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                              ছবির নাম বা ক্যাপশন (ঐচ্ছিক)
                            </label>
                            <input
                              type="text"
                              value={captionInput}
                              onChange={(e) => setCaptionInput(e.target.value)}
                              placeholder="যেমন: বিদ্যালয়ের বার্ষিক সাংস্কৃতিক অনুষ্ঠান"
                              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] outline-none"
                            />
                          </div>

                          <div className="text-[11px] text-gray-500">
                            ফাইলের নাম: <span className="font-semibold text-gray-800">{previewFile?.name}</span>
                            <br />
                            সাইজ: {previewFile ? (previewFile.size / 1024).toFixed(1) : 0} KB
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setPreviewFile(null);
                              setPreviewUrl(null);
                            }}
                            className="text-xs text-red-600 hover:underline inline-flex items-center gap-1 font-semibold"
                          >
                            <X size={12} /> অন্য ছবি নির্বাচন করুন
                          </button>
                        </div>
                      </div>

                      {uploadError && (
                        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                          {uploadError}
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewFile(null);
                            setPreviewUrl(null);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100"
                        >
                          বাতিল
                        </button>
                        <button
                          type="button"
                          onClick={handleUploadSubmit}
                          disabled={uploading}
                          className="px-5 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                        >
                          {uploading ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              আপলোড হচ্ছে...
                            </>
                          ) : (
                            <>
                              <Check size={14} />
                              সংরক্ষণ ও ব্যবহার করুন
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && fetchExistingMedia()}
                        placeholder="নাম বা ক্যাপশন দিয়ে খুঁজুন..."
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={fetchExistingMedia}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg"
                    >
                      খুঁজুন
                    </button>
                  </div>

                  {/* Existing Media Grid */}
                  {isLoading ? (
                    <div className="py-12 text-center text-gray-500">
                      <Loader2 size={24} className="animate-spin mx-auto mb-2 text-[#1e3a5f]" />
                      <span className="text-xs">ছবি লোড হচ্ছে...</span>
                    </div>
                  ) : mediaList.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-1">
                      {mediaList.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            onChange(item.url);
                            setIsOpen(false);
                          }}
                          className={`group relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all aspect-square bg-gray-50 hover:shadow-md ${
                            value === item.url
                              ? "border-[#1e3a5f] ring-2 ring-[#1e3a5f]/30"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={item.caption || item.originalName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {value === item.url && (
                            <div className="absolute top-1 right-1 bg-[#1e3a5f] text-white p-1 rounded-full shadow">
                              <Check size={12} />
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-[10px] text-white truncate font-medium">
                              {item.caption || item.originalName}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-10 text-center text-gray-400">
                      <FolderOpen size={30} className="mx-auto mb-2 opacity-50" />
                      <p className="text-xs">পূর্বে কোনো ছবি আপলোড করা হয়নি</p>
                      <button
                        type="button"
                        onClick={() => setActiveTab("upload")}
                        className="mt-2 text-xs font-bold text-[#1e3a5f] hover:underline"
                      >
                        নতুন ছবি আপলোড করুন
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
