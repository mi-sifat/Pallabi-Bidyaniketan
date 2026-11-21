import { prisma } from "@/lib/prisma";
import GalleryManager from "./GalleryManager";

export default async function AdminGalleryPage() {
  const albums = await prisma.galleryAlbum.findMany({
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
          ফটো গ্যালারি ও অ্যালবাম ব্যবস্থাপনা (Gallery)
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          ক্যাম্পাস, জাতীয় উৎসব, ক্রীড়া ও সাংস্কৃতিক অনুষ্ঠানের ফটো অ্যালবাম তৈরি ও ছবি আপলোড করুন
        </p>
      </div>

      <GalleryManager initialAlbums={albums} />
    </div>
  );
}
