import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Newspaper } from "lucide-react";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };

  const item = await prisma.news.findUnique({
    where: { slug },
    include: { translations: true },
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
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar size={14} />
            <span>
              {new Date(item.createdAt).toLocaleDateString(
                locale === "bn" ? "bn-BD" : "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] leading-snug">
            {tr?.title}
          </h1>
        </div>

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
      </article>
    </div>
  );
}
