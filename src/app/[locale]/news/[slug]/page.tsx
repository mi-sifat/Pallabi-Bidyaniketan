export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, ImageIcon, BookOpen } from "lucide-react";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };

  const item = await prisma.news.findUnique({
    where: { slug },
    include: {
      translations: true,
      album: { include: { images: true } },
      event: true,
    },
  });

  if (!item) {
    notFound();
  }

  const tr =
    item.translations.find((t) => t.locale === locale) ||
    item.translations[0];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <Link
        href={`/${locale}/news`}
        className="inline-flex items-center gap-1.5 text-xs text-[#1e3a5f] font-semibold hover:underline"
      >
        <ArrowLeft size={14} />
        {locale === "bn" ? "সকল সংবাদে ফিরে যান" : "Back to News"}
      </Link>

      <article className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
        <div className="space-y-2 border-b border-gray-100 pb-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(item.createdAt).toLocaleDateString(
                locale === "bn" ? "bn-BD" : "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </span>
            {item.category && (
              <span className="bg-blue-50 text-[#1e3a5f] text-[10px] font-bold px-2 py-0.5 rounded">
                {item.category}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] leading-snug">
            {tr?.title}
          </h1>
        </div>

        {/* Linked Event Details Banner */}
        {item.event && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between text-xs text-purple-900">
            <div className="space-y-0.5">
              <span className="font-bold flex items-center gap-1.5">
                <Calendar size={14} className="text-purple-700" />
                সংযুক্ত স্কুল ইভেন্ট: {item.event.titleBn}
              </span>
              {item.event.location && (
                <span className="text-purple-700 block">
                  স্থান: {item.event.location}
                </span>
              )}
            </div>
            <Link
              href={`/${locale}/events`}
              className="text-xs font-bold text-purple-800 hover:underline"
            >
              ইভেন্ট বিস্তারিত &rarr;
            </Link>
          </div>
        )}

        {item.coverImageUrl && (
          <div className="relative h-64 sm:h-96 w-full rounded-xl overflow-hidden bg-gray-100">
            <Image
              src={item.coverImageUrl}
              alt={tr?.title || "News cover"}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="prose text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
          {tr?.content || tr?.excerpt || "বিস্তারিত বিবরণ নেই।"}
        </div>

        {/* Linked Photo Gallery Album Embedded Inside the Article */}
        {item.album && item.album.images.length > 0 && (
          <div className="pt-8 border-t border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#1e3a5f] flex items-center gap-2">
                <ImageIcon className="text-[#c9a84c]" size={20} />
                {locale === "bn"
                  ? `সংযুক্ত ফটো গ্যালারি: ${item.album.titleBn || item.album.titleEn}`
                  : `Related Photo Album: ${item.album.titleEn}`}
              </h3>
              <Link
                href={`/${locale}/gallery/${item.album.slug}`}
                className="text-xs text-[#1e3a5f] font-bold hover:underline"
              >
                গ্যালারিতে ওপেন করুন &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {item.album.images.slice(0, 6).map((img) => (
                <Link
                  key={img.id}
                  href={`/${locale}/gallery/${item.album?.slug}`}
                  className="relative h-32 rounded-lg overflow-hidden bg-gray-100 group block border border-gray-200"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.captionBn || "Album photo"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
