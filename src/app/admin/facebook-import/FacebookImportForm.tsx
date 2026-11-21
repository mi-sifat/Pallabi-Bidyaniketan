"use client";

import { useState } from "react";
import { Upload, CheckCircle2, AlertCircle, Layers, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FacebookImportForm({
  defaultPageUrl,
}: {
  defaultPageUrl: string;
}) {
  const router = useRouter();
  const [fbPostUrl, setFbPostUrl] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventCategory, setEventCategory] = useState("বার্ষিক ক্রীড়া প্রতিযোগিতা (Annual Sports)");
  const [postedAt, setPostedAt] = useState("");
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  // 3-way linking checkboxes
  const [createAlbum, setCreateAlbum] = useState(true);
  const [createNews, setCreateNews] = useState(true);
  const [createEvent, setCreateEvent] = useState(true);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const categories = [
    "বার্ষিক ক্রীড়া প্রতিযোগিতা (Annual Sports)",
    "সাংস্কৃতিক অনুষ্ঠান ও পুরস্কার বিতরণী (Cultural & Prize-giving)",
    "জাতীয় দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস (National Day)",
    "বিজ্ঞান মেলা ও কুইজ বিতর্ক (Science Fair & Debate)",
    "শিক্ষা সফর ও আনন্দ ভ্রমণ (Study Tour)",
    "অভিভাবক ও শিক্ষক সম্মেলন (Parent-Teacher Meeting)",
    "ক্যাম্পাস ও বিদ্যালয় প্রাঙ্গণ (Campus & Infrastructure)",
    "শিক্ষার্থীদের সাফল্য ও কৃতি সংবর্ধনা (Student Achievement)",
    "অন্যান্য প্রাতিষ্ঠানিক স্মৃতি (Other Memories)",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      let uploadedUrls: string[] = [];

      // Step 1: If files selected, bulk upload them to media library first
      if (files && files.length > 0) {
        const uploadData = new FormData();
        for (let i = 0; i < files.length; i++) {
          uploadData.append("files", files[i]);
        }
        uploadData.append("category", "facebook_import");
        uploadData.append("folder", "facebook");
        uploadData.append("caption", eventTitle || caption);
        uploadData.append("sourcePostUrl", fbPostUrl || defaultPageUrl);

        const uploadRes = await fetch("/api/admin/media/bulk-upload", {
          method: "POST",
          body: uploadData,
        });

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadJson.error || "Image upload failed");
        }
        uploadedUrls = (uploadJson.files || []).map((f: { url: string }) => f.url);
      }

      // Step 2: Call Facebook import API to link records
      const importRes = await fetch("/api/admin/facebook-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fbPostUrl: fbPostUrl || `${defaultPageUrl}/post-${Date.now()}`,
          fbPostId: fbPostUrl ? fbPostUrl.split("/").filter(Boolean).pop() : undefined,
          caption,
          eventTitle: eventTitle || (caption ? caption.substring(0, 50) : "Facebook Event"),
          eventCategory,
          postedAt: postedAt ? new Date(postedAt).toISOString() : new Date().toISOString(),
          mediaUrls: uploadedUrls,
          createAlbum,
          createNews,
          createEvent,
        }),
      });

      const importJson = await importRes.json();
      if (!importRes.ok) {
        throw new Error(importJson.error || "Facebook import failed");
      }

      setStatus("success");
      setMessage("ফেসবুক পোস্ট ও ছবি সফলভাবে আমদানি এবং ৩-মুখী লিঙ্কিং (অ্যালবাম, নিউজ, ইভেন্ট) তৈরি হয়েছে!");
      
      // Reset form
      setFbPostUrl("");
      setEventTitle("");
      setCaption("");
      setFiles(null);
      router.refresh();
    } catch (err: unknown) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
      {status === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          {message}
        </div>
      )}

      {status === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label font-semibold">ফেসবুক পোস্ট URL (Facebook Post Link)</label>
          <input
            type="url"
            placeholder="https://www.facebook.com/Bangabandhu1977/posts/..."
            className="form-input"
            value={fbPostUrl}
            onChange={(e) => setFbPostUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="form-label font-semibold">ইভেন্ট বা অনুষ্ঠানের নাম *</label>
          <input
            type="text"
            required
            placeholder="যেমন: বার্ষিক পুরস্কার বিতরণী ও সাংস্কৃতিক অনুষ্ঠান"
            className="form-input"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label font-semibold">ইভেন্ট ক্যাটাগরি (Event Category) *</label>
          <select
            className="form-input"
            value={eventCategory}
            onChange={(e) => setEventCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label font-semibold">পোস্ট বা অনুষ্ঠানের তারিখ</label>
          <input
            type="date"
            className="form-input"
            value={postedAt}
            onChange={(e) => setPostedAt(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="form-label font-semibold">পোস্টের বিবরণ ও ক্যাপশন (Post Caption / Text)</label>
        <textarea
          rows={3}
          placeholder="ফেসবুক পোস্টের মূল ক্যাপশন বা বিবরণ এখানে পেস্ট করুন..."
          className="form-input"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>

      {/* Bulk Images Selector */}
      <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2">
        <label className="form-label font-semibold flex items-center gap-1.5 text-blue-900">
          <ImageIcon size={16} />
          ফেসবুক পোস্টের ছবিগুলো নির্বাচন করুন (Bulk Photo Upload)
        </label>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#1e3a5f] file:text-white hover:file:bg-[#2a5298]"
          onChange={(e) => setFiles(e.target.files)}
        />
        <p className="text-[11px] text-gray-500">
          * পোস্টের সবগুলো ছবি একবারে নির্বাচন করতে পারেন। ছবিগুলো সার্ভারের নিজস্ব স্টোরেজে সংরক্ষিত হবে।
        </p>
      </div>

      {/* 3-Way Linking Options */}
      <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
        <span className="font-bold text-xs text-[#1e3a5f] flex items-center gap-1.5">
          <Layers size={15} className="text-[#c9a84c]" />
          স্বয়ংক্রিয় ৩-মুখী লিঙ্কিং (Automatic 3-Way Linking):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs text-gray-800">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={createAlbum}
              onChange={(e) => setCreateAlbum(e.target.checked)}
              className="rounded text-[#1e3a5f]"
            />
            <span>১. ফটো গ্যালারি অ্যালবাম তৈরি</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={createNews}
              onChange={(e) => setCreateNews(e.target.checked)}
              className="rounded text-[#1e3a5f]"
            />
            <span>২. নিউজ ও ব্লগ আর্টিকেল তৈরি</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={createEvent}
              onChange={(e) => setCreateEvent(e.target.checked)}
              className="rounded text-[#1e3a5f]"
            />
            <span>৩. ইভেন্ট রেকর্ড তৈরি</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary !text-xs !py-2.5 disabled:opacity-50 inline-flex items-center gap-2"
      >
        <Upload size={16} />
        {loading ? "ছবি আপলোড ও লিঙ্ক তৈরি হচ্ছে..." : "পোস্ট ও ছবি আমদানি করুন (Import Now)"}
      </button>
    </form>
  );
}
