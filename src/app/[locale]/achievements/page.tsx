export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { Trophy, Award, Medal } from "lucide-react";

export default async function AchievementsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const achievements = await prisma.achievement.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
          {locale === "bn" ? "বিদ্যালয়ের উল্লেখযোগ্য অর্জন" : "Institutional Achievements & Awards"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {locale === "bn"
            ? "একাডেমিক সাফল্য, সহশিক্ষা কার্যক্রম, ক্রীড়া ও সাংস্কৃতিক অর্জন"
            : "Honoring excellence in academics, debates, sports, and cultural milestones"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center space-y-2 shadow-sm">
          <Trophy className="mx-auto text-[#c9a84c]" size={32} />
          <h3 className="font-bold text-gray-900 text-sm">একাডেমিক উৎকর্ষতা</h3>
          <p className="text-xs text-gray-600">এসএসসি বোর্ড পরীক্ষায় ধারাবাহিকভাবে সন্তোষজনক ফলাফল অর্জন।</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center space-y-2 shadow-sm">
          <Medal className="mx-auto text-[#c9a84c]" size={32} />
          <h3 className="font-bold text-gray-900 text-sm">খেলাধুলা ও অ্যাথলেটিকস</h3>
          <p className="text-xs text-gray-600">আন্তঃস্কুল ফুটবল ও ক্রিকেট প্রতিযোগিতায় সক্রিয় অংশগ্রহণ।</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center space-y-2 shadow-sm">
          <Award className="mx-auto text-[#c9a84c]" size={32} />
          <h3 className="font-bold text-gray-900 text-sm">সাংস্কৃতিক ও বিতর্ক</h3>
          <p className="text-xs text-gray-600">জাতীয় শিক্ষা সপ্তাহ ও সাংস্কৃতিক প্রতিযোগিতায় শিক্ষার্থীদের গৌরবময় সাফল্য।</p>
        </div>
      </div>

      {achievements.length > 0 ? (
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-bold text-[#1e3a5f]">প্রকাশিত অর্জনের তালিকা</h2>
          {achievements.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{item.titleBn || item.titleEn}</h4>
                <p className="text-gray-500 mt-1">{item.descriptionBn || item.descriptionEn}</p>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
