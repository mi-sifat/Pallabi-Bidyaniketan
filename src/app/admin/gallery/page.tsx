import { prisma } from "@/lib/prisma";
import { Camera, Plus } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminGalleryPage() {
  const albums = await prisma.galleryAlbum.findMany({
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  async function createAlbum(formData: FormData) {
    "use server";
    const titleBn = formData.get("titleBn") as string;
    const coverImageUrl = formData.get("coverImageUrl") as string;
    const category = formData.get("category") as string;

    if (!titleBn) return;
    const slug = `album-${Date.now()}`;

    await prisma.galleryAlbum.create({
      data: {
        slug,
        titleBn,
        titleEn: titleBn,
        coverImageUrl: coverImageUrl || undefined,
        category: category || "Events",
        isPublished: true,
        status: "PUBLISHED",
      },
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/bn/gallery");
    revalidatePath("/en/gallery");
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
          ফটো গ্যালারি ও অ্যালবাম ব্যবস্থাপনা
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          ক্যাম্পাস ছবি ও বিভিন্ন অনুষ্ঠানভিত্তিক ফটো অ্যালবাম পরিচালনা
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-2">
          নতুন অ্যালবাম তৈরি করুন
        </h2>
        <form action={createAlbum} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">অ্যালবামের নাম *</label>
              <input
                type="text"
                name="titleBn"
                required
                placeholder="যেমন: শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">কভার ছবির লিংক</label>
              <input
                type="text"
                name="coverImageUrl"
                placeholder="/uploads/album1.jpg অথবা ইমেজ লিঙ্ক"
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary !text-xs !py-2">
            <Plus size={16} /> অ্যালবাম তৈরি করুন
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-2">
          অ্যালবাম তালিকা ({albums.length})
        </h2>
        {albums.length > 0 ? (
          <div className="space-y-3">
            {albums.map((a) => (
              <div key={a.id} className="p-4 border rounded-xl flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{a.titleBn}</h4>
                  <span className="text-gray-400">{a.images.length} টি ছবি সংযুক্ত</span>
                </div>
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  প্রকাশিত
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-4">কোনো অ্যালবাম নেই।</p>
        )}
      </div>
    </div>
  );
}
