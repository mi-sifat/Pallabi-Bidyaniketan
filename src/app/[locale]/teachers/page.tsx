import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import Image from "next/image";
import { Users, Search, GraduationCap } from "lucide-react";

export default async function TeachersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const query = (await searchParams).q || "";

  // Fetch teachers - if no published teachers yet, show all imported ones with a pending verification notice
  const teachers = await prisma.teacher.findMany({
    where: {
      isArchived: false,
      ...(query
        ? {
            OR: [
              { nameEn: { contains: query } },
              { nameBn: { contains: query } },
              { designationEn: { contains: query } },
              { designationBn: { contains: query } },
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
              ? "ঢাকা শিক্ষা বোর্ডের প্রাতিষ্ঠানিক তথ্যভাণ্ডার ও সরকারি পোর্টাল থেকে প্রাপ্ত তালিকা"
              : "Institutional faculty records from Dhaka Education Board manpower portal"}
          </p>
        </div>

        {/* Search */}
        <form method="GET" className="relative w-full md:w-72">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder={locale === "bn" ? "শিক্ষকের নাম খুঁজুন..." : "Search teacher name..."}
            className="w-full text-xs px-3.5 py-2 pl-9 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
          />
          <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
        </form>
      </div>

      {/* Verification Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
        <GraduationCap size={20} className="shrink-0 text-amber-700 mt-0.5" />
        <div>
          <span className="font-bold">
            {locale === "bn"
              ? "তথ্য যাচাইকরণ অবস্থা (Pending Verification):"
              : "Verification Status:"}
          </span>{" "}
          {locale === "bn"
            ? "নিচে প্রদর্শিত শিক্ষকগণের তথ্য ঢাকা শিক্ষাবোর্ডের সংরক্ষিত ম্যানপাওয়ার পোর্টাল (EIIN: ১০৮৩২৫) থেকে সংগৃহীত। স্কুল কর্তৃপক্ষের চূড়ান্ত অনুমোদনের পর প্রতিটি প্রোফাইল পুরোপুরি ভেরিফাইড হিসেবে হালনাগাদ হবে।"
            : "The listed staff records are sourced from the Dhaka Education Board Manpower Portal (EIIN: 108325) and are undergoing official administrative verification."}
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center flex flex-col items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="space-y-3 w-full">
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 border-2 border-[#1e3a5f]/20 overflow-hidden flex items-center justify-center">
                {teacher.photoUrl ? (
                  <Image
                    src={teacher.photoUrl}
                    alt={teacher.nameEn}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Users size={36} className="text-gray-400" />
                )}
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-sm">
                  {locale === "bn" ? teacher.nameBn || teacher.nameEn : teacher.nameEn}
                </h3>
                <p className="text-xs text-[#1e3a5f] font-semibold mt-0.5">
                  {locale === "bn"
                    ? teacher.designationBn || teacher.designationEn
                    : teacher.designationEn}
                </p>
                {teacher.subjectEn && (
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {locale === "bn" ? teacher.subjectBn || teacher.subjectEn : teacher.subjectEn}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 w-full mt-3 flex items-center justify-between text-[11px] text-gray-400">
              <span>ক্রঃ {teacher.displayOrder}</span>
              <span className="bg-amber-100 text-amber-800 text-[9px] px-2 py-0.5 rounded-full font-medium">
                {teacher.isPublished ? "অনুমোদিত" : "যাচাই প্রক্রিয়াধীন"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
