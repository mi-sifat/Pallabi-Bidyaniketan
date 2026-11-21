export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { Building, Award, Target, CheckCircle2, History } from "lucide-react";

export const revalidate = 60;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const profile = await prisma.schoolProfile.findFirst();

  const schoolName =
    locale === "bn"
      ? profile?.nameBn || "পল্লবী বিদ্যানিকেতন"
      : profile?.nameEn || "Pallabi Bidyaniketan";

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12">
      {/* Title */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
          {locale === "bn" ? "প্রতিষ্ঠান পরিচিতি ও ইতিহাস" : "About Pallabi Bidyaniketan"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {locale === "bn"
            ? "ঐতিহ্য, গৌরব ও শিক্ষার আলো ছড়িয়ে দেওয়ার দীর্ঘ পথচলা"
            : "A legacy of education and excellence in Mirpur-7, Dhaka"}
        </p>
      </div>

      {/* Main Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
          <p>
            {locale === "bn"
              ? `${schoolName} মিরপুর-৭, পল্লবী, ঢাকা-১২১৬-এর মিল্কভিটা রোডে অবস্থিত একটি ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান। ১৯৭৭ সালে প্রতিষ্ঠিত এই বিদ্যালয়টি এ অঞ্চলের শিক্ষার্থীদের জন্য মানসম্মত প্রাথমিক ও মাধ্যমিক শিক্ষা প্রদানে গুরুত্বপূর্ণ ভূমিকা পালন করে আসছে।`
              : `${schoolName} is a distinguished educational institution situated on Milk Vita Road, Mirpur-7, Pallabi, Dhaka-1216. Since its inception in 1977, the school has been dedicated to providing wholesome academic and moral education to generations of students.`}
          </p>
          <p>
            {locale === "bn"
              ? "বিদ্যালয়টি মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, ঢাকার অধীনে পরিচালিত এবং শিক্ষা মন্ত্রণালয়ের নির্দেশনা অনুসারে পরিচালিত। সুশৃঙ্খল পাঠদান, চরিত্র গঠন এবং শিক্ষার্থীদের মেধা বিকাশের লক্ষ্যে দক্ষ ও অভিজ্ঞ শিক্ষকমণ্ডলী নিরলস কাজ করে যাচ্ছেন।"
              : "The institution operates under the Board of Intermediate and Secondary Education (BISE), Dhaka. Led by passionate educators, we emphasize student discipline, analytical skills, and civic responsibility."}
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <History size={16} />
              {locale === "bn" ? "ঐতিহাসিক তথ্যের স্থিতি" : "Historical Data Note"}
            </span>
            <p>
              {locale === "bn"
                ? "প্রতিষ্ঠাকালীন তারিখ (০১ জানুয়ারি ১৯৭৭), শিক্ষকতার অনুমতি (১১ জানুয়ারি ১৯৭৮) এবং প্রথম এমপিওভুক্তির (০১ মে ২০১০) তারিখসমূহ প্রাথমিক প্রশাসনিক যাচাইকরণের জন্য অপেক্ষমান রয়েছে।"
                : "Historical milestones (Founded 1977, Teaching permission 1978, MPO inclusion 2010) are based on institutional portal records and are subject to official verification."}
            </p>
          </div>
        </div>

        {/* Quick Facts Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 h-fit">
          <h3 className="font-bold text-[#1e3a5f] text-base border-b border-gray-100 pb-2">
            {locale === "bn" ? "এক নজরে প্রতিষ্ঠান" : "At a Glance"}
          </h3>
          <ul className="text-xs space-y-3 text-gray-600">
            <li className="flex justify-between border-b border-gray-50 pb-1">
              <span className="text-gray-400">EIIN:</span>
              <span className="font-bold text-gray-800">108325</span>
            </li>
            <li className="flex justify-between border-b border-gray-50 pb-1">
              <span className="text-gray-400">{locale === "bn" ? "বোর্ড:" : "Board:"}</span>
              <span className="font-semibold text-gray-800">ঢাকা বোর্ড</span>
            </li>
            <li className="flex justify-between border-b border-gray-50 pb-1">
              <span className="text-gray-400">{locale === "bn" ? "ধরন:" : "Type:"}</span>
              <span className="font-semibold text-gray-800">সহশিক্ষা (Co-ed)</span>
            </li>
            <li className="flex justify-between border-b border-gray-50 pb-1">
              <span className="text-gray-400">{locale === "bn" ? "এলাকা:" : "Area:"}</span>
              <span className="font-semibold text-gray-800">মিরপুর-৭, পল্লবী</span>
            </li>
            <li className="flex justify-between border-b border-gray-50 pb-1">
              <span className="text-gray-400">{locale === "bn" ? "ফোন:" : "Phone:"}</span>
              <span className="font-semibold text-gray-800">+8801309108325</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
          <div className="flex items-center gap-2 text-[#1e3a5f] font-bold text-lg">
            <Target className="text-[#c9a84c]" size={22} />
            {locale === "bn" ? "আমাদের লক্ষ্য (Mission)" : "Our Mission"}
          </div>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {locale === "bn"
              ? "শিক্ষার্থীদের মধ্যে জ্ঞানের প্রতি আগ্রহ সৃষ্টি, আধুনিক বিজ্ঞানসম্মত শিক্ষা প্রদান এবং মানবিক গুণাবলিসম্পন্ন দেশপ্রেমিক নাগরিক গড়ে তোলা।"
              : "To nurture intellectual curiosity, promote standard education, and foster moral character in young minds."}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
          <div className="flex items-center gap-2 text-[#1e3a5f] font-bold text-lg">
            <Award className="text-[#c9a84c]" size={22} />
            {locale === "bn" ? "আমাদের দৃষ্টিভঙ্গি (Vision)" : "Our Vision"}
          </div>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {locale === "bn"
              ? "মিরপুর ও তৎসংলগ্ন এলাকার একটি অগ্রগণ্য আধুনিক বিদ্যাপীঠ হিসেবে জাতীয় শিক্ষানীতির সাথে সামঞ্জস্য রেখে যুগোপযোগী শিক্ষার্থী তৈরি করা।"
              : "To be a leading center of secondary education inspiring students to excel academically and ethically."}
          </p>
        </div>
      </div>
    </div>
  );
}
