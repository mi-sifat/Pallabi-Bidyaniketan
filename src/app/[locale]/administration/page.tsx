import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { Building2, Users, GraduationCap, Phone, Mail, Award, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdministrationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };

  // Fetch leadership and committee profiles from single source of truth
  const [headTeacher, asstHeadTeacher, committeeMembers] = await Promise.all([
    prisma.adminProfile.findFirst({
      where: { profileType: "HEAD_TEACHER" },
    }),
    prisma.adminProfile.findFirst({
      where: { profileType: "ASSISTANT_HEAD" },
    }),
    prisma.adminProfile.findMany({
      where: {
        profileType: { notIn: ["HEAD_TEACHER", "ASSISTANT_HEAD"] },
        isPublished: true,
      },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  // Fallback data if not yet created in DB
  const headName = locale === "bn" ? headTeacher?.nameBn || "মোঃ শাহে আলম" : headTeacher?.nameEn || "MD. SHAHE ALAM";
  const headDesignation = locale === "bn" ? headTeacher?.designationBn || "প্রধান শিক্ষক" : headTeacher?.designationEn || "Headmaster";
  const headPhoto = headTeacher?.photoUrl || "/uploads/teachers/MD_SHAHE_ALAM.jpg";
  const headMessage = locale === "bn"
    ? headTeacher?.messageBn || "পল্লবী বিদ্যানিকেতন প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভার বিকাশ ও দেশপ্রেমিক সুনাগরিক হিসেবে গড়ে তুলতে নিরলস কাজ করে যাচ্ছে। আমাদের লক্ষ্য আধুনিক প্রযুক্তিনির্ভর ও মূল্যবোধভিত্তিক শিক্ষাদান।"
    : headTeacher?.messageEn || "Dedicated to nurturing academic brilliance, moral integrity, and enlightened citizenship.";

  const asstName = locale === "bn" ? asstHeadTeacher?.nameBn || "রাজিয়া সুলতানা" : asstHeadTeacher?.nameEn || "RAJIA SULTANA";
  const asstDesignation = locale === "bn" ? asstHeadTeacher?.designationBn || "সহকারী প্রধান শিক্ষক" : asstHeadTeacher?.designationEn || "Assistant Headmaster";
  const asstPhoto = asstHeadTeacher?.photoUrl || "/uploads/teachers/RAJIA_SULTANA.jpg";
  const asstMessage = locale === "bn"
    ? asstHeadTeacher?.messageBn || "সহকারী প্রধান শিক্ষক হিসেবে শিক্ষার্থীদের সার্বিক পাঠদান ও শৃঙ্খলার মান নিশ্চিত করতে আমরা সর্বদা সচেষ্ট।"
    : asstHeadTeacher?.messageEn || "Striving to maintain academic excellence and discipline across all grades.";

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-10">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl sm:text-4xl font-black text-[#1e3a5f]">
          {locale === "bn" ? "প্রশাসন ও পরিচালনা পর্ষদ" : "Administration & Managing Committee"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {locale === "bn"
            ? "বিদ্যালয় পরিচালনা কমিটি, প্রধান শিক্ষক, সহকারী প্রধান শিক্ষক ও প্রশাসনিক কর্মকর্তা সংক্রান্ত তথ্য"
            : "Governing body, institutional leadership, and administrative staff of Pallabi Bidyaniketan"}
        </p>
      </div>

      {/* 1. Head Teacher Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-3">
            <Building2 className="text-[#c9a84c]" size={26} />
            <h2 className="text-xl font-bold text-[#1e3a5f]">
              {locale === "bn" ? "প্রধান শিক্ষক" : "Headmaster / Principal"}
            </h2>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            {locale === "bn" ? "প্রতিষ্ঠান প্রধান" : "Head of Institution"}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-32 h-44 rounded-2xl overflow-hidden border-2 border-[#1e3a5f]/20 shadow-md relative shrink-0 bg-gray-50">
            <Image
              src={headPhoto}
              alt={headName}
              fill
              sizes="128px"
              priority
              className="object-cover"
            />
          </div>

          <div className="space-y-3 text-center sm:text-left flex-1">
            <div>
              <h3 className="font-extrabold text-gray-900 text-xl">
                {headName}
              </h3>
              <p className="text-sm font-bold text-[#c9a84c]">
                {headDesignation}
              </p>
              {headTeacher?.qualificationsBn && (
                <p className="text-xs text-gray-500 mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                  <GraduationCap size={14} className="text-[#1e3a5f]" />
                  <span>{locale === "bn" ? headTeacher.qualificationsBn : headTeacher.qualificationsEn || headTeacher.qualificationsBn}</span>
                </p>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic border-l-2 border-[#c9a84c] pl-3 py-0.5">
              “{headMessage}”
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs">
              {headTeacher?.phone && (
                <span className="inline-flex items-center gap-1.5 text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                  <Phone size={12} className="text-[#1e3a5f]" />
                  <span>{headTeacher.phone}</span>
                </span>
              )}
              {headTeacher?.email && (
                <span className="inline-flex items-center gap-1.5 text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                  <Mail size={12} className="text-[#1e3a5f]" />
                  <span>{headTeacher.email}</span>
                </span>
              )}
              <Link
                href={`/${locale}/headmaster-message`}
                className="text-xs font-bold text-[#1e3a5f] hover:text-[#c9a84c] inline-flex items-center gap-1 transition-colors"
              >
                <span>{locale === "bn" ? "বাণী বিস্তারিত পড়ুন" : "Read Full Message"}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Assistant Head Teacher Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-3">
            <Users className="text-[#c9a84c]" size={26} />
            <h2 className="text-xl font-bold text-[#1e3a5f]">
              {locale === "bn" ? "সহকারী প্রধান শিক্ষক" : "Assistant Headmaster"}
            </h2>
          </div>
          <span className="text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            {locale === "bn" ? "শিক্ষা প্রশাসন" : "Academic Administration"}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-32 h-44 rounded-2xl overflow-hidden border-2 border-[#1e3a5f]/20 shadow-md relative shrink-0 bg-gray-50">
            <Image
              src={asstPhoto}
              alt={asstName}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>

          <div className="space-y-3 text-center sm:text-left flex-1">
            <div>
              <h3 className="font-extrabold text-gray-900 text-xl">
                {asstName}
              </h3>
              <p className="text-sm font-bold text-[#c9a84c]">
                {asstDesignation}
              </p>
              {asstHeadTeacher?.qualificationsBn && (
                <p className="text-xs text-gray-500 mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                  <GraduationCap size={14} className="text-[#1e3a5f]" />
                  <span>{locale === "bn" ? asstHeadTeacher.qualificationsBn : asstHeadTeacher.qualificationsEn || asstHeadTeacher.qualificationsBn}</span>
                </p>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic border-l-2 border-[#c9a84c] pl-3 py-0.5">
              “{asstMessage}”
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs">
              {asstHeadTeacher?.phone && (
                <span className="inline-flex items-center gap-1.5 text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                  <Phone size={12} className="text-[#1e3a5f]" />
                  <span>{asstHeadTeacher.phone}</span>
                </span>
              )}
              {asstHeadTeacher?.email && (
                <span className="inline-flex items-center gap-1.5 text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                  <Mail size={12} className="text-[#1e3a5f]" />
                  <span>{asstHeadTeacher.email}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Managing Committee Members */}
      {committeeMembers.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-xl font-bold text-[#1e3a5f]">
              {locale === "bn" ? "বিদ্যালয় পরিচালনা কমিটি (Managing Committee)" : "School Managing Committee"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {locale === "bn"
                ? "পল্লবী বিদ্যানিকেতন পরিচালনা পর্ষদের সম্মানিত সভাপতি ও সদস্যবৃন্দ"
                : "Honorable President and Members of the Governing Body"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {committeeMembers.map((member) => (
              <div
                key={member.id}
                className="bg-gray-50 rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-[#1e3a5f]/20 shadow-xs relative bg-white shrink-0">
                  {member.photoUrl ? (
                    <Image
                      src={member.photoUrl}
                      alt={member.nameBn || member.nameEn}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-lg text-[#1e3a5f] bg-[#1e3a5f]/10">
                      {member.nameBn?.slice(0, 2) || "সদ"}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm">
                    {locale === "bn" ? member.nameBn || member.nameEn : member.nameEn}
                  </h3>
                  <p className="text-xs font-bold text-[#c9a84c] mt-0.5">
                    {locale === "bn" ? member.designationBn : member.designationEn || member.designationBn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
