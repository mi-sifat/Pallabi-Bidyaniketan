import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import Image from "next/image";
import { Camera, Image as ImageIcon } from "lucide-react";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const albums = await prisma.galleryAlbum.findMany({
    where: { isPublished: true },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
          {locale === "bn" ? "ফটো ও ভিডিও গ্যালারি" : "Campus Photo & Video Gallery"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {locale === "bn"
            ? "বিদ্যালয়ের বিভিন্ন অনুষ্ঠান, জাতীয় দিবস উদযাপন, খেলাধুলা ও সাংস্কৃতিক কর্মকাণ্ডের চিত্রমালা"
            : "Memories, cultural festivities, academic events, and sporting activities"}
        </p>
      </div>

      {albums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                {album.coverImageUrl ? (
                  <Image
                    src={album.coverImageUrl}
                    alt={album.titleEn}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <Camera size={36} className="text-gray-400" />
                )}
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-bold text-gray-900 text-sm">
                  {locale === "bn" ? album.titleBn || album.titleEn : album.titleEn}
                </h3>
                <p className="text-xs text-gray-400">
                  {album.images.length} {locale === "bn" ? "টি ছবি" : "photos"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 space-y-2">
          <ImageIcon size={36} className="mx-auto text-gray-400" />
          <h3 className="font-bold text-gray-700">
            {locale === "bn" ? "গ্যালারি প্রস্তুত হচ্ছে" : "Gallery Under Preparation"}
          </h3>
          <p className="text-xs">
            {locale === "bn"
              ? "অ্যাডমিন ড্যাশবোর্ড থেকে সহজেই নতুন অ্যালবাম ও ছবি আপলোড করা যাবে।"
              : "Albums and campus photographs can be uploaded from the Admin Media Library."}
          </p>
        </div>
      )}
    </div>
  );
}
