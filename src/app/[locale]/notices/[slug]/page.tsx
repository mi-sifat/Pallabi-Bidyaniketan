import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Download, Bell } from "lucide-react";

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };

  const notice = await prisma.notice.findUnique({
    where: { slug },
    include: { translations: true },
  });

  if (!notice) {
    notFound();
  }

  const tr =
    notice.translations.find((t) => t.locale === locale) ||
    notice.translations[0];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <Link
        href={`/${locale}/notices`}
        className="inline-flex items-center gap-1.5 text-xs text-[#1e3a5f] font-semibold hover:underline"
      >
        <ArrowLeft size={14} />
        {locale === "bn" ? "সকল নোটিশে ফিরে যান" : "Back to Notices"}
      </Link>

      <article className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar size={14} />
            <span>
              {new Date(notice.createdAt).toLocaleDateString(
                locale === "bn" ? "bn-BD" : "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </span>
            {notice.isImportant && (
              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">
                জরুরি নোটিশ
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] leading-snug">
            {tr?.title || "বিজ্ঞপ্তি"}
          </h1>
        </div>

        <div className="prose text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
          {tr?.content || "এই নোটিশের কোনো অতিরিক্ত বিবরণ প্রদান করা হয়নি।"}
        </div>

        {notice.attachmentUrl && (
          <div className="pt-6 border-t border-gray-100">
            <a
              href={notice.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !text-xs !py-2.5 !px-4"
            >
              <Download size={16} />
              সংযুক্ত ফাইল ডাউনলোড (Download Attachment)
            </a>
          </div>
        )}
      </article>
    </div>
  );
}
