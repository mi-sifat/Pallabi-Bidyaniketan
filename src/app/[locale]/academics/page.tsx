import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { BookOpen, Calendar, Clock, FileCheck } from "lucide-react";
import AcademicClassExplorer, {
  AcademicClassData,
  UploadedRoutine,
  UploadedSyllabus,
} from "@/components/public/AcademicClassExplorer";

export const dynamic = "force-dynamic";

export default async function AcademicsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };

  // Fetch dynamic classes, routines, and syllabi from database
  const [classes, routines, syllabi] = await Promise.all([
    prisma.academicClass.findMany({
      where: { isActive: true },
      include: { subjects: { where: { isActive: true } } },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.routine.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.syllabus.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl space-y-12 print:p-0 print:m-0 print:max-w-none print:space-y-0">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4 print:hidden">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
          {locale === "bn" ? "একাডেমিক তথ্য ও শ্রেণি কার্যক্রম" : "Academics & Curriculum"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {locale === "bn"
            ? "জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) নির্দেশিত পাঠ্যক্রম, বিষয় তালিকা ও শ্রেণি রুটিন"
            : "National curriculum standards, grade-wise subjects, and daily routines"}
        </p>
      </div>

      {/* Interactive Class Explorer (শিশু শ্রেণি থেকে ১০ম শ্রেণি) */}
      <AcademicClassExplorer
        classes={classes as unknown as AcademicClassData[]}
        routines={routines as unknown as UploadedRoutine[]}
        syllabi={syllabi as unknown as UploadedSyllabus[]}
        locale={locale}
      />

      {/* Academic Highlights Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200 print:hidden">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-2 shadow-xs">
          <Calendar className="text-[#c9a84c]" size={24} />
          <h3 className="font-bold text-gray-900 text-base">
            {locale === "bn" ? "বাৎসরিক শিক্ষা ক্যালেন্ডার" : "Academic Calendar"}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            {locale === "bn"
              ? "বাৎসরিক শিক্ষা বর্ষপঞ্জি, সরকারি ছুটি ও অভ্যন্তরীণ পরীক্ষার নির্ধারিত সূচি।"
              : "Annual term schedule, national holidays, and examination schedules."}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-2 shadow-xs">
          <Clock className="text-[#c9a84c]" size={24} />
          <h3 className="font-bold text-gray-900 text-base">
            {locale === "bn" ? "সুশৃঙ্খল ক্লাস রুটিন" : "Structured Routine"}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            {locale === "bn"
              ? "সাপ্তাহিক ক্লাস পিরিয়ড এবং প্রতিটি শ্রেণির জন্য আলাদা সময়সূচি ব্যবস্থাপনা।"
              : "Structured subject periods ensuring balanced learning throughout the week."}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-2 shadow-xs">
          <FileCheck className="text-[#c9a84c]" size={24} />
          <h3 className="font-bold text-gray-900 text-base">
            {locale === "bn" ? "সিলেবাস ও ধারাবাহিক মূল্যায়ন" : "Evaluation System"}
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
