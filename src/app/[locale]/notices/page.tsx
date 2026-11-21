export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { Bell, Calendar, Download, FileText } from "lucide-react";

export const revalidate = 60;

export default async function NoticesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };

  const notices = await prisma.notice.findMany({
    include: { translations: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
          {locale === "bn" ? "নোটিশ ও জরুরি বিজ্ঞপ্তি" : "Official Notices & Announcements"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {locale === "bn"
            ? "বিদ্যালয়ের সকল প্রকার পরীক্ষা, ছুটি ও প্রশাসনিক নোটিশ"
            : "All academic, examination, holiday, and official administrative notices"}
        </p>
      </div>

      {notices.length > 0 ? (
        <div className="space-y-4">
          {notices.map((notice) => {
            const tr =
              notice.translations.find((t) => t.locale === locale) ||
              notice.translations[0];
            return (
              <div
                key={notice.id}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <Calendar size={13} />
                    <span>
                      {new Date(notice.createdAt).toLocaleDateString(
                        locale === "bn" ? "bn-BD" : "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </span>
                    {notice.isImportant && (
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">
                        {locale === "bn" ? "জরুরি" : "Important"}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {tr?.title || "বিজ্ঞপ্তি"}
                  </h3>
                  {tr?.content && (
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {tr.content}
                    </p>
                  )}
                </div>

                {notice.attachmentUrl && (
                  <a
                    href={notice.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary !text-xs !py-1.5 !px-3 shrink-0 self-start md:self-center"
                  >
                    <Download size={14} />
                    PDF ডাউনলোড
                  </a>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 space-y-2">
          <FileText size={36} className="mx-auto text-gray-400" />
          <h3 className="font-bold text-gray-700">
            {locale === "bn" ? "কোনো নোটিশ পাওয়া যায়নি" : "No Notices Published"}
          </h3>
          <p className="text-xs">
            {locale === "bn"
              ? "অ্যাডমিন প্যানেল থেকে নতুন নোটিশ ও সার্কুলার প্রকাশ করা যাবে।"
              : "New notices can be published from the Administrative Dashboard."}
          </p>
        </div>
      )}
    </div>
  );
}
