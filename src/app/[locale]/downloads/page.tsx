export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { Download, FileText } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

export default async function DownloadsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const downloads = await prisma.download.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
          {locale === "bn" ? "ডাউনলোড ও প্রয়োজনীয় ফরম" : "Downloads & Official Forms"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {locale === "bn"
            ? "ভর্তি ফরম, পরীক্ষার রুটিন, সিলেবাস এবং অন্যান্য প্রাতিষ্ঠানিক ডকুমেন্টস"
            : "Downloadable admission documents, academic routines, and official school circulars"}
        </p>
      </div>

      {downloads.length > 0 ? (
        <div className="space-y-3">
          {downloads.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-[#c9a84c]" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {locale === "bn" ? item.titleBn || item.titleEn : item.titleEn}
                  </h3>
                  <span className="text-[11px] text-gray-400">
                    {item.fileSize ? formatFileSize(item.fileSize) : "PDF"}
                  </span>
                </div>
              </div>
              <a
                href={item.fileUrl}
                download
                className="btn-primary !text-xs !py-1.5 !px-3"
              >
                <Download size={14} />
                ডাউনলোড
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 space-y-2">
          <Download size={36} className="mx-auto text-gray-400" />
          <h3 className="font-bold text-gray-700">
            {locale === "bn" ? "কোনো ফাইল নেই" : "No Files Available"}
          </h3>
          <p className="text-xs">
            {locale === "bn"
              ? "অ্যাডমিন প্যানেল থেকে ভর্তি ফরম বা যেকোনো নথি আপলোড করলে এখানে প্রদর্শিত হবে।"
              : "Forms and documents will appear here once uploaded from the CMS."}
          </p>
        </div>
      )}
    </div>
  );
}
