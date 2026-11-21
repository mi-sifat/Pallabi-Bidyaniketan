export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";
import { Camera, Image as ImageIcon, Grid } from "lucide-react";

export const revalidate = 60;

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const albums = await prisma.galleryAlbum.findMany({
    where: { isPublished: true },
    include: { images: { where: { isPublished: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl space-y-8">
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
            {locale === "bn" ? "ফটো গ্যালারি ও অ্যালবাম" : "Photo Gallery & Albums"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {locale === "bn"
              ? "বিদ্যালয়ের বিভিন্ন অনুষ্ঠান, জাতীয় দিবস উদযাপন, খেলাধুলা ও সাংস্কৃতিক কর্মকাণ্ডের চিত্রমালা"
              : "Memories, cultural festivities, academic events, and sporting activities"}
          </p>
        </div>

        {/* Link to All Photos */}
        <Link
          href={`/${locale}/gallery/all`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-bold rounded-lg shadow-xs transition-all self-start sm:self-center shrink-0"
        >
          <Grid size={14} />
          {locale === "bn" ? "একনজরে সকল ছবি দেখুন" : "View All Photos"}
        </Link>
      </div>

      {albums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/${locale}/gallery/${album.slug}`}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all group block flex flex-col justify-between"
            >
              <div>
                <div className="h-52 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  {album.coverImageUrl ? (
                    <Image
                      src={album.coverImageUrl}
                      alt={album.titleBn || album.titleEn}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={80}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Camera size={36} className="text-gray-400" />
                  )}
                  <span className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs z-10">
                    {album.images.length} {locale === "bn" ? "টি ছবি" : "photos"}
                  </span>
                  <span className="absolute bottom-3 left-3 bg-[#1e3a5f]/85 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs z-10">
                    {album.category || "Events"}
                  </span>
                </div>

                <div className="p-4 space-y-1.5">
                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#1e3a5f] transition-colors">
                    {locale === "bn" ? album.titleBn || album.titleEn : album.titleEn}
                  </h3>
                  {album.descriptionBn && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {locale === "bn" ? album.descriptionBn : album.descriptionEn || album.descriptionBn}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0 text-xs font-bold text-[#1e3a5f] group-hover:text-[#c9a84c] flex items-center gap-1 transition-colors">
                <span>{locale === "bn" ? "অ্যালবামটি খুলুন" : "Open Album"}</span>
                <span>&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 space-y-2">
          <ImageIcon size={40} className="mx-auto text-gray-300" />
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
