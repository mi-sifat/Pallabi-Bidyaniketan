import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { Users, GraduationCap, HeartHandshake } from "lucide-react";

export default async function AlumniPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const alumni = await prisma.alumniStory.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
          {locale === "bn" ? "প্রাক্তন শিক্ষার্থী ও অ্যালামনাই" : "Students & Alumni Corner"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {locale === "bn"
            ? "পল্লবী বিদ্যানিকেতনের প্রাক্তন শিক্ষার্থীদের সাফল্য ও স্মৃতিচারণ"
            : "Celebrating the journey and accomplishments of our graduates"}
        </p>
      </div>

      <div className="bg-[#1e3a5f] text-white p-8 rounded-2xl shadow-sm space-y-3">
        <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2">
          <HeartHandshake size={22} />
          {locale === "bn" ? "অ্যালামনাই নেটওয়ার্ক" : "Alumni Network"}
        </h2>
        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
          {locale === "bn"
            ? "১৯৭৭ সাল থেকে আজ পর্যন্ত যারা পল্লবী বিদ্যানিকেতন থেকে এসএসসি সম্পন্ন করেছেন, আপনারা আমাদের গর্ব। দেশ ও বিদেশের বিভিন্ন ক্ষেত্রে আপনাদের সাফল্য বিদ্যালয়ের সুনাম বৃদ্ধি করছে।"
            : "From 1977 to the present, our graduates have excelled globally in medicine, engineering, governance, and business, carrying forward our institutional values."}
        </p>
      </div>

      {alumni.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alumni.map((a) => (
            <div key={a.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-2">
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                ব্যাচ: {a.batch}
              </span>
              <h3 className="font-bold text-gray-900 text-base">{a.nameBn || a.nameEn}</h3>
              <p className="text-xs text-gray-500">{a.profession}</p>
              <p className="text-xs text-gray-700 leading-relaxed pt-2 italic">
                &ldquo;{a.storyBn || a.storyEn}&rdquo;
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 space-y-2">
          <GraduationCap size={36} className="mx-auto text-gray-400" />
          <h3 className="font-bold text-gray-700">অ্যালামনাই তথ্য প্রক্রিয়াধীন</h3>
          <p className="text-xs">
            প্রাক্তন শিক্ষার্থীদের গল্প ও স্মৃতিচারণ খুব শীঘ্রই এখানে প্রকাশিত হবে।
          </p>
        </div>
      )}
    </div>
  );
}
