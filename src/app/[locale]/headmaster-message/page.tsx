export const dynamic = "force-dynamic";
import Image from "next/image";
import Link from "next/link";
import { Building, GraduationCap, Users, Phone, Mail, MapPin, ArrowRight, BookOpen, Quote } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function HeadmasterMessagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };

  // Fetch headmaster record if available
  const headmaster = await prisma.teacher.findFirst({
    where: {
      OR: [
        { designationEn: { contains: "Headmaster" } },
        { designationBn: { contains: "প্রধান শিক্ষক" } },
        { nameEn: { contains: "SHAHE ALAM" } },
      ],
    },
  });

  const photoUrl = headmaster?.photoUrl || "/uploads/teachers/MD_SHAHE_ALAM.jpg";
  const name =
    locale === "bn"
      ? headmaster?.nameBn || "মোঃ শাহে আলম"
      : headmaster?.nameEn || "MD. SHAHE ALAM";
  const designation =
    locale === "bn"
      ? headmaster?.designationBn || "প্রধান শিক্ষক"
      : headmaster?.designationEn || "Headmaster";

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 flex items-center gap-2">
        <Link href={`/${locale}`} className="hover:text-[#1e3a5f] transition-colors">
          {locale === "bn" ? "হোম" : "Home"}
        </Link>
        <span>/</span>
        <span className="text-[#1e3a5f] font-semibold">
          {locale === "bn" ? "প্রধান শিক্ষকের বাণী" : "Headmaster's Message"}
        </span>
      </nav>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#1e3a5f] via-[#244774] to-[#1e3a5f] p-8 sm:p-12 text-white relative">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#1e3a5f] text-xs font-black px-3.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              <Building size={14} />
              <span>পল্লবী বিদ্যানিকেতন • EIIN: ১০৮৩২৫</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight drop-shadow-sm">
              {locale === "bn" ? "প্রধান শিক্ষকের বাণী" : "Message from the Headmaster"}
            </h1>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-2xl">
              {locale === "bn"
                ? "শিক্ষার্থীদের সুপ্ত প্রতিভার বিকাশ, চরিত্র গঠন এবং নৈতিক মূল্যবোধে আলোকিত জাতি গঠনের প্রত্যয়"
                : "Dedicated to nurturing academic brilliance, moral integrity, and enlightened citizenship"}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Headmaster Profile Sidebar */}
          <div className="lg:col-span-4 bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center space-y-4">
            <div className="w-44 h-56 mx-auto rounded-2xl overflow-hidden border-4 border-[#1e3a5f]/20 shadow-md relative bg-white">
              <Image
                src={photoUrl}
                alt={name}
                fill
                sizes="144px"
                priority
                className="object-cover"
              />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-[#1e3a5f]">
                {name}
              </h2>
              <p className="text-xs font-bold text-[#c9a84c] mt-0.5">
                {designation}
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                পল্লবী বিদ্যানিকেতন, মিরপুর-৭, ঢাকা
              </p>
            </div>

            <div className="pt-2 border-t border-gray-200 space-y-2 text-left text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <GraduationCap size={15} className="text-[#1e3a5f] shrink-0" />
                <span>প্রতিষ্ঠাকাল: ১৯৭৭ খ্রিষ্টাব্দ</span>
              </div>
              <div className="flex items-center gap-2">
                <Building size={15} className="text-[#1e3a5f] shrink-0" />
                <span>ঢাকা মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষাবোর্ড</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-[#1e3a5f] shrink-0" />
                <span>মিল্কভিটা রোড, মিরপুর-৭, পল্লবী, ঢাকা-১২১৬</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/${locale}/teachers`}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#1e3a5f] hover:bg-[#2b5182] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <Users size={14} />
                <span>{locale === "bn" ? "সকল শিক্ষকের তালিকা" : "Faculty Directory"}</span>
              </Link>
            </div>
          </div>

          {/* Full Message Text */}
          <div className="lg:col-span-8 space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
            <div className="p-4 bg-amber-50 rounded-2xl border-l-4 border-[#c9a84c] text-gray-800 text-sm italic font-medium flex gap-3">
              <Quote size={28} className="text-[#c9a84c] shrink-0 mt-1" />
              <p>
                {locale === "bn"
                  ? "“শিক্ষাই জাতির মেরুদণ্ড, আর সুশিক্ষা হলো আলোকিত জীবনের মূল চাবিকাঠি। আমাদের লক্ষ্য কেবল পাঠ্যপুস্তকের জ্ঞান দান নয়, বরং প্রতিটি শিক্ষার্থীকে একজন দেশপ্রেমিক, নীতিবান ও মানবিক গুণসম্পন্ন সুনাগরিক হিসেবে গড়ে তোলা।”"
                  : "“Education is the backbone of a nation, and true enlightenment lies in values and character. Our purpose is not merely academic tutoring, but preparing holistic, responsible, and visionary citizens.”"}
              </p>
            </div>

            {locale === "bn" ? (
              <div className="space-y-4 text-justify">
                <p>
                  <strong>বিসমিল্লাহির রাহমানির রাহিম।</strong>
                </p>
                <p>
                  ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান <strong>পল্লবী বিদ্যানিকেতন</strong> (EIIN: ১০৮৩২৫)-এর অফিশিয়াল ওয়েবসাইটে সবাইকে আন্তরিক শুভেচ্ছা ও অভিনন্দন জানাচ্ছি। ১৯৭৭ সালে প্রতিষ্ঠার পর থেকে এই বিদ্যাপীঠটি মিরপুর অঞ্চলের শিক্ষা বিস্তারে এক অনন্য ভূমিকা পালন করে আসছে।
                </p>
                <p>
                  বর্তমান যুগ তথ্যপ্রযুক্তি ও আধুনিক উদ্ভাবনের যুগ। শিক্ষার্থীদেরকে আধুনিক পৃথিবীর চ্যালেঞ্জ মোকাবিলার উপযোগী করে গড়ে তুলতে আমরা নিয়মিত শ্রেণিকক্ষ পাঠদানের পাশাপাশি কম্পিউটার ল্যাব, বিজ্ঞানাগার ও ডিজিটাল শিক্ষা কার্যক্রম জোরদার করেছি। একই সাথে শিক্ষার্থীদের শারীরিক ও মানসিক বিকাশের জন্য বার্ষিক ক্রীড়া প্রতিযোগিতা, সাহিত্য ও সাংস্কৃতিক সপ্তাহ, বিতর্ক এবং বিজ্ঞান মেলার আয়োজন নিয়মিত করা হয়।
                </p>
                <p>
                  আমাদের রয়েছে একদল অভিজ্ঞ, দক্ষ ও নিবেদিতপ্রাণ শিক্ষক-শিক্ষিকা, যারা পরম স্নেহে ও আন্তরিকতায় প্রতিটি শিক্ষার্থীর মেধার সঠিক পরিচর্যা করে থাকেন। অভিভাবকগণের সক্রিয় সহযোগিতা ও সুপরামর্শ আমাদের এই পথচলাকে আরও সমৃদ্ধ করেছে।
                </p>
                <p>
                  আমি দৃঢ়ভাবে বিশ্বাস করি, বিদ্যালয়ের পরিচালনা পর্ষদ, সম্মানিত শিক্ষকমণ্ডলী, প্রিয় শিক্ষার্থী এবং শ্রদ্ধেয় অভিভাবকদের সম্মিলিত প্রচেষ্টায় পল্লবী বিদ্যানিকেতন আগামী দিনগুলোতে আরও গৌরবোজ্জ্বল সাফল্য বয়ে আনবে এবং দেশের শীর্ষস্থানীয় শিক্ষাপ্রতিষ্ঠানগুলোর একটি হিসেবে নিজেদের প্রতিষ্ঠিত করবে।
                </p>
                <p className="pt-2">
                  সবার সুস্বাস্থ্য, দীর্ঘায়ু ও সাফল্য কামনা করি।
                </p>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-[#1e3a5f] text-base">{name}</p>
                    <p className="text-xs text-gray-500 font-semibold">{designation}</p>
                    <p className="text-xs text-gray-400">পল্লবী বিদ্যানিকেতন, ঢাকা</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#c9a84c] font-bold">EIIN: ১০৮৩২৫</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-justify">
                <p>
                  <strong>Warm Greetings,</strong>
                </p>
                <p>
                  Welcome to the official web portal of <strong>Pallabi Bidyaniketan</strong> (EIIN: 108325). Since our inception in 1977, our institution has been steadily guiding generations of young learners towards intellectual excellence and ethical integrity.
                </p>
                <p>
                  Today’s world demands critical thinking, scientific acumen, and adaptability. In alignment with modern national curriculum directives, we combine strong core academics with modern digital resources, interactive science labs, and co-curricular opportunities in sports, debate, and creative arts.
                </p>
                <p>
                  Our dedicated faculty members work tirelessly to provide personalized attention and mentoring. With the active cooperation of our valued guardians and the school managing committee, we strive to maintain a safe, disciplined, and nurturing environment for every student.
                </p>
                <p className="pt-2">
                  Wishing all our students, teachers, and guardians success and good health.
                </p>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-[#1e3a5f] text-base">{name}</p>
                    <p className="text-xs text-gray-500 font-semibold">{designation}</p>
                    <p className="text-xs text-gray-400">Pallabi Bidyaniketan, Dhaka</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#c9a84c] font-bold">EIIN: 108325</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
