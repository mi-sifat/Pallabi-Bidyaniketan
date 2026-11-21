export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, GraduationCap, Calendar, Award } from "lucide-react";

export default async function TeacherDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = (await params) as { locale: Locale; id: string };

  const teacher = await prisma.teacher.findUnique({
    where: { id },
  });

  if (!teacher || teacher.isArchived) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <Link
        href={`/${locale}/teachers`}
        className="inline-flex items-center gap-1.5 text-xs text-[#1e3a5f] font-semibold hover:underline"
      >
        <ArrowLeft size={14} />
        {locale === "bn" ? "শিক্ষক তালিকায় ফিরে যান" : "Back to Faculty Directory"}
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-gray-100 pb-8">
          <div className="w-32 h-32 rounded-2xl bg-gray-100 overflow-hidden border-2 border-[#1e3a5f]/20 flex items-center justify-center shrink-0">
            {teacher.photoUrl ? (
              <Image
                src={teacher.photoUrl}
                alt={teacher.nameEn}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            ) : (
              <User size={48} className="text-gray-400" />
            )}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="inline-block bg-amber-50 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded border border-amber-200">
              {teacher.isPublished ? "অনুমোদিত শিক্ষক" : "যাচাই প্রক্রিয়াধীন (Pending)"}
            </div>
            <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
              {locale === "bn" ? teacher.nameBn || teacher.nameEn : teacher.nameEn}
            </h1>
            <p className="text-sm font-semibold text-gray-700">
              {locale === "bn" ? teacher.designationBn || teacher.designationEn : teacher.designationEn}
            </p>
            {teacher.subjectEn && (
              <p className="text-xs text-gray-500">
                বিষয়: {locale === "bn" ? teacher.subjectBn || teacher.subjectEn : teacher.subjectEn}
              </p>
            )}
          </div>
        </div>

        <div className="py-6 space-y-4 text-xs sm:text-sm text-gray-700">
          <h3 className="font-bold text-[#1e3a5f] text-base">প্রাতিষ্ঠানিক তথ্য</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
              <span className="text-gray-400 text-xs">তথ্যসূত্র (Data Source):</span>
              <p className="font-semibold text-gray-800">{teacher.sourceReference || "Dhaka Education Board Manpower Portal"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
              <span className="text-gray-400 text-xs">স্ট্যাটাস:</span>
              <p className="font-semibold text-gray-800">{teacher.isCurrent ? "বর্তমান শিক্ষক" : "প্রাক্তন শিক্ষক"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
