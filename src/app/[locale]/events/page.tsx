import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, ImageIcon } from "lucide-react";

export default async function PublicEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const events = await prisma.schoolEvent.findMany({
    where: { isPublished: true },
    include: { album: { include: { images: true } } },
    orderBy: { eventDate: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
          {locale === "bn" ? "বিদ্যালয়ের ইভেন্ট ও অনুষ্ঠানসূচি" : "Events & Activity Calendar"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {locale === "bn"
            ? "বার্ষিক ক্রীড়া, সাংস্কৃতিক অনুষ্ঠান, পুরস্কার বিতরণী ও জাতীয় দিবস উদযাপন"
            : "Annual sports, science fairs, celebrations, and academic ceremonies"}
        </p>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div>
                {ev.coverImageUrl ? (
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={ev.coverImageUrl}
                      alt={ev.titleBn || ev.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 bg-[#1e3a5f]/85 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                      {ev.category}
                    </span>
                  </div>
                ) : (
                  <div className="h-32 bg-linear-to-r from-[#1e3a5f]/10 to-amber-100/30 flex items-center justify-center text-[#1e3a5f]/40">
                    <Calendar size={36} />
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar size={13} className="text-[#c9a84c]" />
                      {ev.eventDate
                        ? new Date(ev.eventDate).toLocaleDateString(
                            locale === "bn" ? "bn-BD" : "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                          )
                        : "তারিখ নির্ধারিত নয়"}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base group-hover:text-[#1e3a5f] transition-colors">
                    {locale === "bn" ? ev.titleBn || ev.titleEn : ev.titleEn}
                  </h3>

                  {ev.location && (
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#c9a84c] shrink-0" />
                      <span>{ev.location}</span>
                    </p>
                  )}

                  {ev.descriptionBn && (
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {locale === "bn" ? ev.descriptionBn : ev.descriptionEn || ev.descriptionBn}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-gray-100 mt-2 flex items-center justify-between">
                <Link
                  href={`/${locale}/events/${ev.slug}`}
                  className="text-xs font-bold text-[#1e3a5f] hover:text-[#c9a84c] inline-flex items-center gap-1 pt-3"
                >
                  {locale === "bn" ? "বিস্তারিত দেখুন" : "View Details"} &rarr;
                </Link>

                {ev.album && (
                  <Link
                    href={`/${locale}/gallery/${ev.album.slug}`}
                    className="text-xs font-semibold text-gray-500 hover:text-[#1e3a5f] inline-flex items-center gap-1 pt-3"
                  >
                    <ImageIcon size={13} />
                    {locale === "bn" ? "অ্যালবাম" : "Album"} ({ev.album.images?.length || 0})
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 space-y-2">
          <Calendar size={40} className="mx-auto text-gray-300" />
          <h3 className="font-bold text-gray-700">
            {locale === "bn" ? "কোনো ইভেন্ট নেই" : "No Events Scheduled"}
          </h3>
          <p className="text-xs">
            {locale === "bn"
              ? "বর্তমানে কোনো নির্ধারিত অনুষ্ঠান বা ইভেন্ট নেই।"
              : "No upcoming events scheduled at this moment."}
          </p>
        </div>
      )}
    </div>
  );
}
