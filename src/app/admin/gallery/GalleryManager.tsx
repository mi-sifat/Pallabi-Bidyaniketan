"use client";

import { useState } from "react";
import {
  Camera,
  Plus,
  Trash2,
  X,
  CheckCircle,
  Eye,
  Loader2,
  FolderPlus,
  Image as ImageIcon,
} from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";

interface GalleryImage {
  id: string;
  imageUrl: string;
  captionBn?: string | null;
}

interface Album {
  id: string;
  slug: string;
  titleBn: string | null;
  titleEn: string;
  category: string | null;
  coverImageUrl: string | null;
  descriptionBn: string | null;
  isPublished: boolean;
  images: GalleryImage[];
}

export default function GalleryManager({
  initialAlbums,
}: {
  initialAlbums: Album[];
}) {
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states for new album
  const [titleBn, setTitleBn] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [category, setCategory] = useState("ক্যাম্পাস ও পরিবেশ");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [albumImages, setAlbumImages] = useState<string[]>([]);
  const [descriptionBn, setDescriptionBn] = useState("");

  const handleAddAlbumPhoto = (url: string) => {
    if (url && !albumImages.includes(url)) {
      setAlbumImages([...albumImages, url]);
      if (!coverImageUrl) setCoverImageUrl(url);
    }
  };

  const handleRemoveAlbumPhoto = (index: number) => {
    setAlbumImages(albumImages.filter((_, i) => i !== index));
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn) return alert("অ্যালবামের নাম আবশ্যক");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleBn,
          titleEn: titleEn || titleBn,
          category,
          coverImageUrl: coverImageUrl || albumImages[0] || null,
          descriptionBn,
          images: albumImages,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "অ্যালবাম তৈরি ব্যর্থ হয়েছে");
      }

      setAlbums([data.album, ...albums]);
      setIsCreateOpen(false);
      setTitleBn("");
      setTitleEn("");
      setCoverImageUrl("");
      setAlbumImages([]);
      setDescriptionBn("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "সমস্যা হয়েছে";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই পুরো অ্যালবামটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAlbums(albums.filter((a) => a.id !== id));
        if (activeAlbum?.id === id) setActiveAlbum(null);
      }
    } catch (err) {
      console.error("Delete album error:", err);
    }
  };

  const handleDeletePhoto = async (albumId: string, imageId: string) => {
    if (!confirm("এই ছবিটি অ্যালবাম থেকে মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/admin/gallery/${albumId}?imageId=${imageId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAlbums(
          albums.map((a) =>
            a.id === albumId
              ? { ...a, images: a.images.filter((img) => img.id !== imageId) }
              : a
          )
        );
        if (activeAlbum?.id === albumId) {
          setActiveAlbum({
            ...activeAlbum,
            images: activeAlbum.images.filter((img) => img.id !== imageId),
          });
        }
      }
    } catch (err) {
      console.error("Delete photo error:", err);
    }
  };

  const handleAddPhotosToExistingAlbum = async (url: string) => {
    if (!activeAlbum || !url) return;
    try {
      const res = await fetch(`/api/admin/gallery/${activeAlbum.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newImages: [url] }),
      });
      const data = await res.json();
      if (data.success && data.album) {
        setAlbums(albums.map((a) => (a.id === activeAlbum.id ? data.album : a)));
        setActiveAlbum(data.album);
      }
    } catch (err) {
      console.error("Add photo error:", err);
    }
  };

  const togglePublish = async (album: Album) => {
    const newStatus = !album.isPublished;
    try {
      const res = await fetch(`/api/admin/gallery/${album.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: newStatus }),
      });
      if (res.ok) {
        setAlbums(
          albums.map((a) => (a.id === album.id ? { ...a, isPublished: newStatus } : a))
        );
      }
    } catch (err) {
      console.error("Toggle publish error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <h3 className="text-xs font-bold text-gray-700">
            মোট অ্যালবাম: {albums.length} টি
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-bold rounded-lg shadow-xs inline-flex items-center gap-1.5"
        >
          <Plus size={16} /> নতুন অ্যালবাম তৈরি করুন
        </button>
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {albums.map((album) => (
          <div
            key={album.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
                {album.coverImageUrl ? (
                  <img
                    src={album.coverImageUrl}
                    alt={album.titleBn || album.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Camera size={36} />
                  </div>
                )}
                <span className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                  {album.images?.length || 0} ছবি
                </span>
                <span className="absolute bottom-2 left-2 bg-[#1e3a5f]/80 text-white text-[9px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                  {album.category || "Events"}
                </span>
              </div>

              <div className="p-3.5 space-y-1">
                <h4 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1">
                  {album.titleBn || album.titleEn}
                </h4>
                {album.descriptionBn && (
                  <p className="text-[11px] text-gray-500 line-clamp-2">
                    {album.descriptionBn}
                  </p>
                )}
              </div>
            </div>

            <div className="p-3.5 pt-0 border-t border-gray-100 mt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveAlbum(album)}
                className="text-xs font-bold text-[#1e3a5f] hover:underline inline-flex items-center gap-1 pt-2"
              >
                <Eye size={13} /> ছবিসমূহ পরিচালনা
              </button>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => togglePublish(album)}
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    album.isPublished ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {album.isPublished ? "প্রকাশিত" : "ড্রাফট"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteAlbum(album.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="অ্যালবাম মুছুন"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Album Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-[#1e3a5f] text-sm sm:text-base">
                নতুন ফটো অ্যালবাম তৈরি করুন
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    অ্যালবামের নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    placeholder="যেমন: বার্ষিক পুরস্কার বিতরণী অনুষ্ঠান ২০২৪"
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
                    <option value="ক্যাম্পাস ও পরিবেশ">ক্যাম্পাস ও পরিবেশ (Campus)</option>
                    <option value="সাংস্কৃতিক অনুষ্ঠান">সাংস্কৃতিক অনুষ্ঠান (Cultural)</option>
                    <option value="ক্রীড়া ও খেলাধুলা">ক্রীড়া ও খেলাধুলা (Sports)</option>
                    <option value="জাতীয় দিবস">জাতীয় দিবস (National Days)</option>
                    <option value="পুরস্কার বিতরণী">পুরস্কার বিতরণী (Awards)</option>
                    <option value="ঐতিহাসিক স্মৃতি">ঐতিহাসিক স্মৃতি (Historical)</option>
                  </select>
                </div>
              </div>

              {/* Cover Image */}
              <MediaPicker
                value={coverImageUrl}
                onChange={setCoverImageUrl}
                label="অ্যালবামের কভার ছবি (Cover Photo)"
                category="gallery"
                helpText="অ্যালবামের জন্য প্রধান থাম্বনেইল ছবি নির্বাচন করুন"
              />

              {/* Multiple Photos */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-xs font-bold text-gray-800">
                  অ্যালবামে ছবি যুক্ত করুন ({albumImages.length} টি ছবি)
                </label>
                {albumImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-2 max-h-36 overflow-y-auto p-1">
                    {albumImages.map((url, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden h-16 border bg-white">
                        <img src={url} alt={`Img ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveAlbumPhoto(idx)}
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
                  onChange={handleAddAlbumPhoto}
                  label=""
                  category="gallery"
                  helpText="ছবি যোগ করতে ক্লিক করুন (একাধিকবার ক্লিক করে একাধিক ছবি যোগ করতে পারবেন)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  value={descriptionBn}
                  onChange={(e) => setDescriptionBn(e.target.value)}
                  placeholder="অ্যালবামের প্রেক্ষাপট বা ছবির বিবরণ..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
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
                  অ্যালবাম তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Album Detail / Photos Management Modal */}
      {activeAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="font-bold text-[#1e3a5f] text-sm sm:text-base">
                  {activeAlbum.titleBn || activeAlbum.titleEn}
                </h3>
                <p className="text-[11px] text-gray-500">
                  মোট {activeAlbum.images.length} টি ছবি সংযুক্ত আছে
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveAlbum(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Add New Photo to this Album */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
                <h4 className="text-xs font-bold text-[#1e3a5f]">
                  এই অ্যালবামে নতুন ছবি যোগ করুন
                </h4>
                <MediaPicker
                  value=""
                  onChange={handleAddPhotosToExistingAlbum}
                  label=""
                  category="gallery"
                  helpText="ছবি নির্বাচন বা আপলোড করলেই সরাসরি অ্যালবামে যুক্ত হবে"
                />
              </div>

              {/* Photos Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700">বর্তমান ছবিসমূহ</h4>
                {activeAlbum.images.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {activeAlbum.images.map((img) => (
                      <div
                        key={img.id}
                        className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-100 shadow-2xs"
                      >
                        <img
                          src={img.imageUrl}
                          alt="Album image"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(activeAlbum.id, img.id)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 py-6 text-center">
                    এই অ্যালবামে এখনও কোনো ছবি নেই। উপরের বাটন ব্যবহার করে ছবি যোগ করুন।
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
