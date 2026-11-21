export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import ResultsExplorer from "@/components/public/ResultsExplorer";

export const revalidate = 60;

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const results = await prisma.resultArchive.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f]">
          {locale === "bn" ? "পরীক্ষার ফলাফল ও বোর্ড আর্কাইভ" : "Examination Results & Board Archive"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {locale === "bn"
            ? "পল্লবী বিদ্যানিকেতনের বার্ষিক, অর্ধবার্ষিক, টেস্ট এবং ঢাকা শিক্ষা বোর্ডের এসএসসি ফলাফল বিবরণী"
            : "Annual, mid-term, test exam sheets and official Dhaka Education Board results"}
        </p>
      </div>

      {/* Interactive Results Explorer */}
      <ResultsExplorer results={results} locale={locale} />
    </div>
  );
}
