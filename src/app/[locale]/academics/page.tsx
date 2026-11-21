import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { BookOpen, Calendar, Clock, FileCheck } from "lucide-react";

export default async function AcademicsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const classes = await prisma.academicClass.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-10">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
          {locale === "bn" ? "একাডেমিক তথ্য ও শ্রেণি কার্যক্রম" : "Academics & Curriculum"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {locale === "bn"
            ? "জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) নির্দেশিত পাঠ্যক্রম ও শ্রেণি বিন্যাস"
            : "Curriculum, grade structures, and academic activities following national standards"}
        </p>
      </div>

      {/* Grade levels overview */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <BookOpen size={20} className="text-[#c9a84c]" />
          {locale === "bn" ? "শ্রেণি বিন্যাস (Classes)" : "Grade Levels Offered"}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white p-5 rounded-xl border border-gray-200 text-center space-y-1 shadow-sm"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center font-bold text-lg mb-2">
                {cls.level}
              </div>
              <h3 className="font-bold text-gray-800 text-sm">
                {locale === "bn" ? cls.nameBn || cls.nameEn : cls.nameEn}
              </h3>
              <p className="text-[10px] text-gray-400 font-medium">
                {cls.isActive ? "সক্রিয়" : "যাচাই প্রক্রিয়াধীন"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-2 shadow-sm">
          <Calendar className="text-[#c9a84c]" size={24} />
          <h3 className="font-bold text-gray-900 text-base">
            {locale === "bn" ? "একাডেমিক ক্যালেন্ডার" : "Academic Calendar"}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            {locale === "bn"
              ? "বাৎসরিক শিক্ষা বর্ষপঞ্জি, সরকারি ছুটি ও অভ্যন্তরীণ পরীক্ষার নির্ধারিত সূচি।"
              : "Annual term schedule, national holidays, and examination schedules."}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-2 shadow-sm">
          <Clock className="text-[#c9a84c]" size={24} />
          <h3 className="font-bold text-gray-900 text-base">
            {locale === "bn" ? "ক্লাস রুটিন" : "Class Routine"}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            {locale === "bn"
              ? "সাপ্তাহিক ক্লাস পিরিয়ড এবং প্রতিটি শ্রেণির জন্য আলাদা সময়সূচি ব্যবস্থাপনা।"
              : "Structured subject periods ensuring balanced learning throughout the week."}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-2 shadow-sm">
          <FileCheck className="text-[#c9a84c]" size={24} />
          <h3 className="font-bold text-gray-900 text-base">
            {locale === "bn" ? "সিলেবাস ও মূল্যায়ন" : "Syllabus & Evaluation"}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            {locale === "bn"
              ? "নতুন শিক্ষাক্রমের আলোকে ধারাবাহিক মূল্যায়ন ও সামষ্টিক মূল্যায়ন ব্যবস্থা।"
              : "Formative and summative assessments complying with modern educational criteria."}
          </p>
        </div>
      </div>
    </div>
  );
}
