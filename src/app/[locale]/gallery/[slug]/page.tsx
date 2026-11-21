import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };

  const album = await prisma.galleryAlbum.findUnique({
    where: { slug },
    include: { images: true },
  });

  if (!album) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl space-y-8">
      <Link
        href={`/${locale}/gallery`}
        className="inline-flex items-center gap-1.5 text-xs text-[#1e3a5f] font-semibold hover:underline"
      >
        <ArrowLeft size={14} />
        {locale === "bn" ? "সকল অ্যালবামে ফিরে যান" : "Back to Gallery"}
      </Link>

      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
          {locale === "bn" ? album.titleBn || album.titleEn : album.titleEn}
        </h1>
        {album.descriptionBn && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {locale === "bn" ? album.descriptionBn : album.descriptionEn}
          </p>
        )}
      </div>

      {album.images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {album.images.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm group"
            >
              <div className="relative h-60 w-full bg-gray-100">
                <Image
                  src={img.imageUrl}
                  alt={img.captionEn || "Album image"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {img.captionBn && (
                <div className="p-3 text-xs text-gray-700">
                  {locale === "bn" ? img.captionBn : img.captionEn}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          <Camera size={36} className="mx-auto text-gray-400 mb-2" />
          <p className="text-xs">এই অ্যালবামে এখনও কোনো ছবি আপলোড করা হয়নি।</p>
        </div>
      )}
    </div>
  );
}
