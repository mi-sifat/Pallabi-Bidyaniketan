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
    include: { album: true },
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
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Calendar size={13} />
                    {ev.eventDate ? new Date(ev.eventDate).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US") : "TBD"}
                  </span>
                  <span className="bg-blue-50 text-[#1e3a5f] text-[10px] font-bold px-2 py-0.5 rounded">
                    {ev.category}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 text-base">
                  {locale === "bn" ? ev.titleBn || ev.titleEn : ev.titleEn}
                </h3>

                {ev.location && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={12} className="text-[#c9a84c] shrink-0" />
                    <span>{ev.location}</span>
                  </p>
                )}

                {ev.descriptionBn && (
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {locale === "bn" ? ev.descriptionBn : ev.descriptionEn}
                  </p>
                )}
              </div>

              {ev.album && (
                <div className="p-5 pt-0 border-t border-gray-50 mt-3">
                  <Link
                    href={`/${locale}/gallery/${ev.album.slug}`}
                    className="text-xs font-bold text-[#1e3a5f] hover:text-[#c9a84c] inline-flex items-center gap-1.5 pt-3"
                  >
                    <ImageIcon size={14} className="text-[#c9a84c]" />
                    {locale === "bn" ? "ফটো অ্যালবাম দেখুন" : "View Photo Album"} &rarr;
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 space-y-2">
          <Calendar size={36} className="mx-auto text-gray-400" />
          <h3 className="font-bold text-gray-700">
            {locale === "bn" ? "কোনো ইভেন্ট নেই" : "No Events Scheduled"}
          </h3>
          <p className="text-xs">
            {locale === "bn"
              ? "অ্যাডমিন প্যানেল অথবা ফেসবুক ইমপোর্টার থেকে অনুষ্ঠান যুক্ত করলে এখানে দেখতে পারবেন।"
              : "Events imported or created from the dashboard will be displayed here."}
          </p>
        </div>
      )}
    </div>
  );
}
