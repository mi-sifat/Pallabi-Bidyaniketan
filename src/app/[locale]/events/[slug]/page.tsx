import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, ArrowLeft, ImageIcon } from "lucide-react";
import GalleryLightbox from "@/components/public/GalleryLightbox";

export default async function PublicEventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };

  const event = await prisma.schoolEvent.findUnique({
    where: { slug },
    include: {
      album: {
        include: { images: true },
      },
    },
  });

  if (!event || !event.isPublished) {
    notFound();
  }

  const title = locale === "bn" ? event.titleBn || event.titleEn : event.titleEn;
  const description =
    locale === "bn" ? event.descriptionBn : event.descriptionEn || event.descriptionBn;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      {/* Back button */}
      <div>
        <Link
          href={`/${locale}/events`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e3a5f] hover:text-[#c9a84c] transition-colors"
        >
          <ArrowLeft size={14} />
          {locale === "bn" ? "সকল ইভেন্টে ফিরে যান" : "Back to Events"}
        </Link>
      </div>

      {/* Main Card */}
      <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {event.coverImageUrl && (
          <div className="relative h-72 sm:h-96 w-full bg-gray-100">
            <img
              src={event.coverImageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-50 text-[#1e3a5f] text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
                {event.category}
              </span>
              {event.eventDate && (
                <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                  <Calendar size={13} className="text-[#c9a84c]" />
                  {new Date(event.eventDate).toLocaleDateString(
                    locale === "bn" ? "bn-BD" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] leading-snug">
              {title}
            </h1>

            {event.location && (
              <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5">
                <MapPin size={15} className="text-[#c9a84c] shrink-0" />
                <span>{event.location}</span>
              </p>
            )}
          </div>

          {/* Description */}
          {description && (
            <div className="border-t border-gray-100 pt-6 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {description}
            </div>
          )}

          {/* Attached Gallery Album Photos */}
          {event.album && event.album.images.length > 0 && (
            <div className="border-t border-gray-100 pt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
                  <ImageIcon size={18} className="text-[#c9a84c]" />
                  {locale === "bn" ? "অনুষ্ঠানের ফটো অ্যালবাম" : "Event Photos"} (
                  {event.album.images.length})
                </h3>
                <Link
                  href={`/${locale}/gallery/${event.album.slug}`}
                  className="text-xs font-bold text-[#1e3a5f] hover:underline"
                >
                  {locale === "bn" ? "গ্যালারিতে দেখুন" : "View in Gallery"} &rarr;
                </Link>
              </div>

              <GalleryLightbox
                images={event.album.images.map((img) => ({
                  id: img.id,
                  imageUrl: img.imageUrl,
                  caption: locale === "bn" ? img.captionBn || title : img.captionEn || title,
                }))}
              />
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
