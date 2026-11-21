import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { Award, FileText, CheckCircle2, AlertTriangle } from "lucide-react";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const results = await prisma.resultArchive.findMany({
    where: { isPublished: true },
    orderBy: { academicYear: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
          {locale === "bn" ? "পরীক্ষার ফলাফল আর্কাইভ" : "Examination Results Archive"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {locale === "bn"
            ? "এসএসসি ও অভ্যন্তরীণ পরীক্ষার বার্ষিক ফলাফল ও পরিসংখ্যান"
            : "SSC Board and internal examination results and merit statistics"}
        </p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
        <AlertTriangle size={18} className="shrink-0 text-amber-700 mt-0.5" />
        <div>
          <span className="font-bold">
            {locale === "bn" ? "ফলাফল তথ্যের সততা নীতিমালা:" : "Integrity Notice:"}
          </span>{" "}
          {locale === "bn"
            ? "শুধুমাত্র ঢাকা শিক্ষা বোর্ড ও বিদ্যালয়ের সংরক্ষিত অফিসিয়াল গেজেটের যাচাইকৃত ফলাফল এখানে প্রকাশ করা হয়। কোনো অসত্য বা মনগড়া জিপিএ-৫ কিংবা পাসের হার প্রকাশ করা হয় না।"
            : "Only officially verified examination records from Dhaka Board gazettes are published here."}
        </div>
      </div>

      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((res) => (
            <div
              key={res.id}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between"
            >
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase">
                  {res.academicYear} | {res.examType}
                </span>
                <h3 className="font-bold text-gray-900 text-base mt-1">
                  {res.titleBn || res.titleEn}
                </h3>
              </div>
              {res.fileUrl && (
                <a
                  href={res.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary !text-xs !py-2"
                >
                  ফলাফল দেখুন / ডাউনলোড
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 space-y-2">
          <Award size={36} className="mx-auto text-gray-400" />
          <h3 className="font-bold text-gray-700">
            {locale === "bn" ? "কোনো ফলাফল সংরক্ষিত নেই" : "No Published Results"}
          </h3>
          <p className="text-xs">
            {locale === "bn"
              ? "বোর্ড ও অভ্যন্তরীণ ফলাফল প্রশাসনিকভাবে যুক্ত হওয়ার পর এখানে দেখতে পারবেন।"
              : "Historical and board results will be populated upon administrative review."}
          </p>
        </div>
      )}
    </div>
  );
}
