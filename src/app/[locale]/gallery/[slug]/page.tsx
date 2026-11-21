export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Camera, BookOpen, Calendar } from "lucide-react";
import GalleryLightbox from "@/components/public/GalleryLightbox";

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };

  const album = await prisma.galleryAlbum.findUnique({
    where: { slug },
    include: {
      images: { where: { isPublished: true } },
      news: true,
      events: true,
    },
  });

  if (!album) {
    notFound();
  }

  const linkedNews = album.news.length > 0 ? album.news[0] : null;
  const linkedEvent = album.events.length > 0 ? album.events[0] : null;

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

      {/* 3-Way Linking: Related News Article & Event Banners */}
      {(linkedNews || linkedEvent) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {linkedNews && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
              <span className="font-semibold flex items-center gap-1.5">
                <BookOpen size={15} className="text-[#1e3a5f]" />
                সম্পর্কিত ব্লগ / আর্টিকেল প্রকাশিত হয়েছে
              </span>
              <Link
                href={`/${locale}/news/${linkedNews.slug}`}
                className="font-bold text-[#1e3a5f] hover:underline"
              >
                আর্টিকেল পড়ুন &rarr;
              </Link>
            </div>
          )}

          {linkedEvent && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between text-xs text-purple-900">
              <span className="font-semibold flex items-center gap-1.5">
                <Calendar size={15} className="text-purple-700" />
                সম্পর্কিত ইভেন্ট: {linkedEvent.titleBn}
              </span>
              <Link
                href={`/${locale}/events`}
                className="font-bold text-purple-800 hover:underline"
              >
                ইভেন্ট সূচি &rarr;
              </Link>
            </div>
          )}
        </div>
      )}

      {album.images.length > 0 ? (
        <GalleryLightbox images={album.images} locale={locale} />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          <Camera size={36} className="mx-auto text-gray-400 mb-2" />
          <p className="text-xs">এই অ্যালবামে এখনও কোনো ছবি আপলোড করা হয়নি।</p>
        </div>
      )}
    </div>
  );
}
