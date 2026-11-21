import type { Locale } from "@/lib/i18n";
import { GraduationCap, CheckCircle, HelpCircle, PhoneCall, Download } from "lucide-react";

export default async function AdmissionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-10">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
          {locale === "bn" ? "ভর্তি সংক্রান্ত তথ্য ও নির্দেশিকা" : "Admission Information & Guidelines"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {locale === "bn"
            ? "পল্লবী বিদ্যানিকেতনে বিভিন্ন শ্রেণিতে ভর্তির যোগ্যতা, নিয়মাবলী ও প্রয়োজনীয় তথ্যাদি"
            : "Admission procedure, prerequisites, and registration guidelines"}
        </p>
      </div>

      {/* Guidelines Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
              <GraduationCap className="text-[#c9a84c]" size={22} />
              {locale === "bn" ? "ভর্তির সাধারণ নিয়মাবলী" : "General Admission Rules"}
            </h2>
            <ul className="text-xs sm:text-sm text-gray-700 space-y-2.5">
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                <span>
                  {locale === "bn"
                    ? "শিক্ষা মন্ত্রণালয় ও ঢাকা শিক্ষা বোর্ডের ভর্তি নীতিমালা অনুসারে শিক্ষার্থীদের ভর্তি নেওয়া হয়।"
                    : "Admissions strictly follow guidelines issued by the Ministry of Education and Dhaka Education Board."}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                <span>
                  {locale === "bn"
                    ? "অনলাইনে অথবা স্কুল কার্যালয় থেকে সরাসরি ভর্তি ফরম সংগ্রহ ও জমা দেওয়া যাবে।"
                    : "Application forms can be acquired from the school administrative office."}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                <span>
                  {locale === "bn"
                    ? "পূর্ববর্তী ক্লাসের প্রশংসাপত্র, নম্বরপত্র এবং ডিজিটাল জন্ম সনদের কপি আবশ্যক।"
                    : "Original birth certificate copy, previous progress report, and transfer certificate required."}
                </span>
              </li>
            </ul>
          </div>

          {/* Required Documents */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-900 text-base">
              {locale === "bn" ? "প্রয়োজনীয় কাগজপত্র" : "Required Documents"}
            </h3>
            <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-1.5">
              <li>{locale === "bn" ? "ডিজিটাল জন্ম সনদের ফটোকপি (অনলাইন যাচাইযোগ্য)" : "Digital Birth Registration Certificate"}</li>
              <li>{locale === "bn" ? "পাসপোর্ট সাইজ সত্যায়িত ছবি (৩ কপি)" : "Recent passport-size photographs (3 copies)"}</li>
              <li>{locale === "bn" ? "পিতা ও মাতার জাতীয় পরিচয়পত্রের (NID) ফটোকপি" : "Parent's National ID (NID) copies"}</li>
              <li>{locale === "bn" ? "পূর্ববর্তী প্রতিষ্ঠানের প্রত্যয়নপত্র / ট্রান্সফার সার্টিফিকেট (প্রযোজ্য ক্ষেত্রে)" : "Transfer Certificate from previous institution"}</li>
            </ul>
          </div>
        </div>

        {/* Admission Help Card */}
        <div className="space-y-6">
          <div className="bg-[#1e3a5f] text-white p-6 rounded-xl shadow-md space-y-4">
            <div className="flex items-center gap-2 font-bold text-base text-amber-300">
              <PhoneCall size={18} />
              {locale === "bn" ? "ভর্তি তথ্য কেন্দ্র" : "Admission Helpdesk"}
            </div>
            <p className="text-xs text-gray-200 leading-relaxed">
              {locale === "bn"
                ? "ভর্তি সংক্রান্ত যেকোনো প্রশ্নের জন্য সরাসরি বিদ্যালয় অফিসে যোগাযোগ করুন অথবা ফোনে কথা বলুন।"
                : "For inquiries regarding seat availability and fees, please call our office."}
            </p>
            <div className="space-y-1 text-xs">
              <div className="font-semibold text-white">ফোন: +8801309108325</div>
              <div className="text-gray-300">অফিস সময়: সকাল ৯:০০ - দুপুর ২:০০</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
