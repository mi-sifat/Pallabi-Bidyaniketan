export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";
import { Newspaper, Calendar, ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const newsList = await prisma.news.findMany({
    where: { isPublished: true },
    include: { translations: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
          {locale === "bn" ? "সংবাদ ও ইভেন্টস" : "News & Activities"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {locale === "bn"
            ? "বিদ্যালয়ের শিক্ষা সফর, ক্রীড়া প্রতিযোগিতা, সাংস্কৃতিক অনুষ্ঠান ও জাতীয় দিবস উদযাপনের সংবাদ"
            : "Latest updates, co-curricular events, sports, and celebrations at our institution"}
        </p>
      </div>

      {newsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsList.map((item) => {
            const tr =
              item.translations.find((t) => t.locale === locale) ||
              item.translations[0];
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                    {item.coverImageUrl ? (
                      <Image
                        src={item.coverImageUrl}
                        alt={tr?.title || "News"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Newspaper size={36} className="text-gray-400" />
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(item.createdAt).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US")}
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2">
                      {tr?.title || "শিরোনাম"}
                    </h3>
                    {tr?.excerpt && (
                      <p className="text-xs text-gray-600 line-clamp-3">
                        {tr.excerpt}
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <Link
                    href={`/${locale}/news/${item.slug}`}
                    className="text-xs font-bold text-[#1e3a5f] hover:text-[#c9a84c] inline-flex items-center gap-1"
                  >
                    {locale === "bn" ? "বিস্তারিত পড়ুন" : "Read More"} &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 space-y-2">
          <Newspaper size={36} className="mx-auto text-gray-400" />
          <h3 className="font-bold text-gray-700">
            {locale === "bn" ? "কোনো সংবাদ প্রকাশিত হয়নি" : "No News Articles Published"}
          </h3>
          <p className="text-xs">
            {locale === "bn"
              ? "অ্যাডমিন প্যানেল থেকে বিদ্যালয়ের যেকোনো অনুষ্ঠান বা অর্জনের খবর প্রকাশ করা যাবে।"
              : "News and event stories will appear here once published from the CMS."}
          </p>
        </div>
      )}
    </div>
  );
}
