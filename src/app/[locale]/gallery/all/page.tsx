import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import GalleryLightbox from "@/components/public/GalleryLightbox";

export const revalidate = 60;

export default async function AllPhotosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };

  // Fetch all published photos across all published albums
  const photos = await prisma.galleryImage.findMany({
    where: {
      isPublished: true,
      album: { isPublished: true },
    },
    include: {
      album: { select: { titleBn: true, titleEn: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl space-y-8">
      <div>
        <Link
          href={`/${locale}/gallery`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e3a5f] hover:text-[#c9a84c] transition-colors"
        >
          <ArrowLeft size={14} />
          {locale === "bn" ? "অ্যালবামসমূহে ফিরে যান" : "Back to Albums"}
        </Link>
      </div>

      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
          {locale === "bn" ? "সকল ক্যাম্পাস ও ইভেন্ট ছবি" : "All Campus & Event Photos"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {locale === "bn"
            ? `বিভিন্ন অ্যালবামে সংগৃহীত মোট ${photos.length} টি আলোকচিত্র`
            : `Browse all ${photos.length} photographs across all albums`}
        </p>
      </div>

      {photos.length > 0 ? (
        <GalleryLightbox
          images={photos.map((p) => ({
            id: p.id,
            imageUrl: p.imageUrl,
            caption:
              locale === "bn"
                ? p.captionBn || p.album?.titleBn || "পল্লবী বিদ্যানিকেতন"
                : p.captionEn || p.album?.titleEn || "Pallabi Bidyaniketan",
          }))}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 space-y-2">
          <ImageIcon size={40} className="mx-auto text-gray-300" />
          <h3 className="font-bold text-gray-700">কোনো ছবি পাওয়া যায়নি</h3>
          <p className="text-xs">অ্যাডমিন ড্যাশবোর্ড থেকে ছবি যুক্ত করা হলে এখানে দেখা যাবে।</p>
        </div>
      )}
    </div>
  );
}
