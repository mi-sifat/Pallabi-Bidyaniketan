export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import Image from "next/image";
import { Users, Search, GraduationCap } from "lucide-react";

export const revalidate = 60;

export default async function TeachersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const query = (await searchParams).q || "";

  const teachers = await prisma.teacher.findMany({
    where: {
      isArchived: false,
      isPublished: true,
      ...(query
        ? {
            OR: [
              { nameEn: { contains: query } },
              { nameBn: { contains: query } },
              { designationEn: { contains: query } },
              { designationBn: { contains: query } },
              { subjectEn: { contains: query } },
              { subjectBn: { contains: query } },
            ],
          }
        : {}),
    },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
            {locale === "bn" ? "শিক্ষকমণ্ডলীর তালিকা" : "Faculty & Staff Directory"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {locale === "bn"
              ? "পল্লবী বিদ্যানিকেতন (EIIN: ১০৮৩২৫)-এর সম্মানিত শিক্ষকমণ্ডলী ও স্টাফদের অফিশিয়াল তথ্য তালিকা"
              : "Official faculty and staff directory of Pallabi Bidyaniketan (EIIN: 108325)"}
          </p>
        </div>

        {/* Search */}
        <form method="GET" className="relative w-full md:w-72">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder={locale === "bn" ? "শিক্ষকের নাম বা বিষয় দিয়ে খুঁজুন..." : "Search teacher or subject..."}
            className="w-full text-xs px-3.5 py-2 pl-9 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
          />
          <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
        </form>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-xl shadow-xs border border-gray-200 p-5 text-center flex flex-col items-center justify-between hover:shadow-md transition-shadow group"
          >
            <div className="space-y-3 w-full">
              <div className="w-36 h-48 mx-auto rounded-2xl bg-gray-100 border-2 border-[#1e3a5f]/20 overflow-hidden flex items-center justify-center relative shadow-sm group-hover:border-[#c9a84c] transition-all">
                {teacher.photoUrl ? (
                  <Image
                    src={teacher.photoUrl}
                    alt={teacher.nameEn}
                    fill
                    sizes="144px"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50 text-[#1e3a5f]">
                    <Users size={44} className="text-gray-400" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-bold text-[#1e3a5f] text-sm group-hover:text-blue-900 transition-colors">
                  {locale === "bn" ? teacher.nameBn || teacher.nameEn : teacher.nameEn}
                </h3>
                {locale === "bn" && teacher.nameBn && (
                  <p className="text-[11px] text-gray-400 mt-0.5">{teacher.nameEn}</p>
                )}
                <div className="mt-1.5 inline-block bg-blue-50 text-[#1e3a5f] text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-blue-100">
                  {locale === "bn"
                    ? teacher.designationBn || teacher.designationEn
                    : teacher.designationEn || teacher.designationBn}
                </div>
              </div>

              {/* Subject */}
              {(teacher.subjectBn || teacher.subjectEn) && (
                <div className="text-xs text-gray-600 bg-gray-50 py-1 px-2 rounded-md">
                  <span className="font-medium text-gray-400">
                    {locale === "bn" ? "বিষয়: " : "Subject: "}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {locale === "bn"
                      ? teacher.subjectBn || teacher.subjectEn
                      : teacher.subjectEn || teacher.subjectBn}
                  </span>
                </div>
              )}

              {/* Educational Qualifications */}
              {(teacher.qualificationsBn || teacher.qualificationsEn) && (
                <div className="text-[11px] text-gray-500 italic">
                  {locale === "bn"
                    ? teacher.qualificationsBn || teacher.qualificationsEn
                    : teacher.qualificationsEn || teacher.qualificationsBn}
                </div>
              )}
            </div>

            {/* Bottom Status Indicator */}
            <div className="w-full pt-3 mt-4 border-t border-gray-100 text-[10px] text-gray-400 flex items-center justify-between">
              <span>ক্রম: #{teacher.displayOrder}</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                {locale === "bn" ? "নিয়মিত শিক্ষক" : "Active Faculty"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {teachers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Users size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-bold text-gray-700">কোনো শিক্ষক তথ্য পাওয়া যায়নি</h3>
          <p className="text-xs text-gray-400 mt-1">
            অনুসন্ধান শর্ত পরিবর্তন করে পুনরায় চেষ্টা করুন
          </p>
        </div>
      )}
    </div>
  );
}
