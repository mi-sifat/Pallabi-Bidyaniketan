import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { Building2, ShieldCheck, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdministrationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const profiles = await prisma.adminProfile.findMany({
    where: { isPublished: true },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
          {locale === "bn" ? "প্রশাসন ও পরিচালনা পর্ষদ" : "Administration & Managing Committee"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {locale === "bn"
            ? "বিদ্যালয় পরিচালনা কমিটি, প্রধান শিক্ষক ও প্রশাসনিক কর্মকর্তা সংক্রান্ত তথ্য"
            : "Governing body, institutional leadership, and administrative staff"}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
          <Building2 className="text-[#c9a84c]" size={24} />
          <h2 className="text-xl font-bold text-[#1e3a5f]">
            {locale === "bn" ? "প্রধান শিক্ষক" : "Headmaster / Principal"}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-24 h-24 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center font-bold text-xl text-[#1e3a5f] shrink-0 border border-gray-200">
            শ.আ
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-gray-900 text-lg">
              {locale === "bn" ? "মোঃ শাহে আলম" : "MD. SHAHE ALAM"}
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              {locale === "bn" ? "প্রধান শিক্ষক" : "Headmaster"}
            </p>
            <p className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md inline-block mt-2">
              {locale === "bn"
                ? "তথ্য সূত্র: ঢাকা শিক্ষা বোর্ড পোর্টাল (যাচাই প্রক্রিয়াধীন)"
                : "Source: Dhaka Education Board Portal (Pending Verification)"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
          <Users className="text-[#c9a84c]" size={24} />
          <h2 className="text-xl font-bold text-[#1e3a5f]">
            {locale === "bn" ? "সহকারী প্রধান শিক্ষক" : "Assistant Headmaster"}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-24 h-24 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center font-bold text-xl text-[#1e3a5f] shrink-0 border border-gray-200">
            রা.সু
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-gray-900 text-lg">
              {locale === "bn" ? "রাজিয়া সুলতানা" : "RAJIA SULTANA"}
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              {locale === "bn" ? "সহকারী প্রধান শিক্ষক" : "Assistant Headmaster"}
            </p>
            <p className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md inline-block mt-2">
              {locale === "bn"
                ? "তথ্য সূত্র: ঢাকা শিক্ষা বোর্ড পোর্টাল (যাচাই প্রক্রিয়াধীন)"
                : "Source: Dhaka Education Board Portal (Pending Verification)"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
