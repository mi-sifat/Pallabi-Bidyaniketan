import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import {
  Bell,
  Calendar,
  BookOpen,
  Award,
  Users,
  Building,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };

  // Fetch published data from DB
  const [profile, notices, newsList, featuredTeachers, recentImages, classes] =
    await Promise.all([
      prisma.schoolProfile.findFirst(),
      prisma.notice.findMany({
        where: { isPublished: true },
        include: { translations: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.news.findMany({
        where: { isPublished: true },
        include: { translations: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.teacher.findMany({
        where: { isPublished: true, isArchived: false },
        orderBy: { displayOrder: "asc" },
        take: 4,
      }),
      prisma.galleryImage.findMany({
        where: { isPublished: true },
        take: 6,
      }),
      prisma.academicClass.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

  const schoolName =
    locale === "bn"
      ? profile?.nameBn || "পল্লবী বিদ্যানিকেতন"
      : profile?.nameEn || "Pallabi Bidyaniketan";

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-r from-[#1e3a5f] to-[#0f243e] text-white py-16 md:py-24 overflow-hidden shadow-inner">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c9a84c_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#f5d77f] px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
                <Sparkles size={14} />
                EIIN: {profile?.eiin || "108325"} | ঢাকা শিক্ষাবোর্ড
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {schoolName}
              </h1>
              <p className="text-base sm:text-lg text-gray-200 max-w-2xl leading-relaxed">
                {locale === "bn"
                  ? "মিরপুর-৭, পল্লবী, ঢাকায় অবস্থিত একটি আধুনিক, মানসম্মত এবং আদর্শ মাধ্যমিক শিক্ষা প্রতিষ্ঠান। জ্ঞান, সততা ও মানবিক মূল্যবোধে ভবিষ্যৎ প্রজন্ম গড়ার অঙ্গীকার।"
                  : "A distinguished secondary educational institution located in Mirpur-7, Pallabi, Dhaka. Fostering knowledge, integrity, and future-ready global citizenship."}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href={`/${locale}/admission`}
                  className="bg-[#c9a84c] hover:bg-[#b8963e] text-[#1e3a5f] font-bold px-6 py-3 rounded-lg shadow-md transition-all hover:shadow-lg inline-flex items-center gap-2"
                >
                  <GraduationCap size={18} />
                  {locale === "bn" ? "ভর্তি তথ্য" : "Admission Info"}
                </Link>
                <Link
                  href={`/${locale}/about`}
                  className="border-2 border-white/80 hover:bg-white hover:text-[#1e3a5f] text-white font-semibold px-6 py-3 rounded-lg transition-all inline-flex items-center gap-2"
                >
                  <BookOpen size={18} />
                  {locale === "bn" ? "প্রতিষ্ঠান পরিচিতি" : "About School"}
                </Link>
              </div>
            </div>

            {/* School Logo Emblem */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/20 shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform">
                <Image
                  src={profile?.logoUrl || "/uploads/branding/logo.jpg"}
                  alt={schoolName}
                  width={200}
                  height={200}
                  className="rounded-xl object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notice Scroller & Highlights */}
      <section className="container mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 w-fit">
            <Bell size={14} className="animate-pulse" />
            {locale === "bn" ? "জরুরি ঘোষণা" : "Announcements"}
          </div>
          <div className="flex-1 overflow-hidden">
            {notices.length > 0 ? (
              <div className="flex items-center gap-4 text-sm font-medium text-gray-800">
                <span className="text-[#1e3a5f] font-semibold">
                  {notices[0].translations.find((t) => t.locale === locale)?.title ||
                    notices[0].translations[0]?.title ||
                    "বিদ্যালয়ের সকল কার্যক্রম নিয়মিত সময়সূচি অনুযায়ী চলছে।"}
                </span>
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">
                {locale === "bn"
                  ? "নতুন কোনো জরুরি বিজ্ঞপ্তি প্রকাশিত হয়নি।"
                  : "No new emergency notices published."}
              </p>
            )}
          </div>
          <Link
            href={`/${locale}/notices`}
            className="text-xs font-semibold text-[#1e3a5f] hover:text-[#c9a84c] shrink-0 inline-flex items-center gap-1"
          >
            {locale === "bn" ? "সকল নোটিশ" : "All Notices"}
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Main Content Grid: Notices & Headmaster Message */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Latest Notices */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h2 className="text-xl font-bold text-[#1e3a5f] flex items-center gap-2">
                <Bell size={20} className="text-[#c9a84c]" />
                {locale === "bn" ? "সর্বশেষ নোটিশ বোর্ড" : "Notice Board"}
              </h2>
              <Link
                href={`/${locale}/notices`}
                className="text-xs text-[#1e3a5f] font-semibold hover:underline"
              >
                {locale === "bn" ? "আরও দেখুন" : "View More"} &rarr;
              </Link>
            </div>

            {notices.length > 0 ? (
              <div className="space-y-3">
                {notices.map((notice) => {
                  const tr =
                    notice.translations.find((t) => t.locale === locale) ||
                    notice.translations[0];
                  return (
                    <Link
                      key={notice.id}
                      href={`/${locale}/notices/${notice.slug}`}
                      className="block p-4 rounded-xl bg-white border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-xs text-gray-400 font-medium">
                            {new Date(notice.createdAt).toLocaleDateString(
                              locale === "bn" ? "bn-BD" : "en-US",
                              { year: "numeric", month: "short", day: "numeric" }
                            )}
                          </span>
                          <h3 className="font-semibold text-gray-900 hover:text-[#1e3a5f] transition-colors mt-1">
                            {tr?.title || "বিজ্ঞপ্তি"}
                          </h3>
                        </div>
                        {notice.isImportant && (
                          <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                            {locale === "bn" ? "জরুরি" : "Important"}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500 text-sm">
                {locale === "bn"
                  ? "অনুমোদিত কোনো নোটিশ এই মুহূর্তে প্রদর্শিত নেই। প্রশাসনিক প্যানেল থেকে প্রকাশ করুন।"
                  : "No published notices currently available."}
              </div>
            )}
          </div>

          {/* Headmaster Message Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <Building className="text-[#c9a84c]" size={22} />
                <h2 className="text-lg font-bold text-[#1e3a5f]">
                  {locale === "bn"
                    ? "প্রধান শিক্ষকের বাণী"
                    : "Headmaster's Message"}
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center font-bold text-[#1e3a5f] text-xl border border-gray-200 shrink-0">
                    শ.আ
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {locale === "bn" ? "মোঃ শাহে আলম" : "MD. SHAHE ALAM"}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {locale === "bn" ? "প্রধান শিক্ষক" : "Headmaster"}
                    </p>
                    <span className="inline-block bg-amber-50 text-amber-700 text-[10px] px-2 py-0.5 rounded font-medium mt-1">
                      {locale === "bn" ? "যাচাই প্রক্রিয়াধীন" : "Verification Pending"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  {locale === "bn"
                    ? "পল্লবী বিদ্যানিকেতন ১৯৭৭ সাল থেকে মিরপুরের শিক্ষার্থীদের মানসম্মত শিক্ষা ও চরিত্র গঠনে ভূমিকা রেখে আসছে। আমাদের লক্ষ্য প্রতিটি শিক্ষার্থীকে সুনাগরিক হিসেবে গড়ে তোলা।"
                    : "Pallabi Bidyaniketan has been serving the community in Mirpur since 1977, fostering quality education and moral values for tomorrow's leaders."}
                </p>
                <div className="pt-2">
                  <Link
                    href={`/${locale}/about`}
                    className="text-xs font-semibold text-[#1e3a5f] hover:text-[#c9a84c] inline-flex items-center gap-1"
                  >
                    {locale === "bn" ? "বিস্তারিত পড়ুন" : "Read full message"} &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Institutional Information Highlights */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-[#1e3a5f]">
              {locale === "bn" ? "প্রতিষ্ঠান পরিচিতি ও তথ্য" : "Institutional Highlights"}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {locale === "bn"
                ? "সরকারি পোর্টাল ও বোর্ডের নথি থেকে সংগৃহীত প্রাথমিক তথ্য"
                : "Official data referenced from Dhaka Education Board portal"}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center space-y-1">
              <Award className="mx-auto text-[#c9a84c]" size={28} />
              <div className="text-2xl font-extrabold text-[#1e3a5f]">108325</div>
              <div className="text-xs text-gray-600 font-medium">
                {locale === "bn" ? "অফিসিয়াল EIIN" : "Official EIIN"}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center space-y-1">
              <Calendar className="mx-auto text-[#c9a84c]" size={28} />
              <div className="text-2xl font-extrabold text-[#1e3a5f]">1977</div>
              <div className="text-xs text-gray-600 font-medium">
                {locale === "bn" ? "প্রতিষ্ঠাকাল (যাচাইযোগ্য)" : "Established (Pending)"}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center space-y-1">
              <Users className="mx-auto text-[#c9a84c]" size={28} />
              <div className="text-2xl font-extrabold text-[#1e3a5f]">20+</div>
              <div className="text-xs text-gray-600 font-medium">
                {locale === "bn" ? "শিক্ষক ও কর্মকর্তা" : "Teachers & Staff"}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center space-y-1">
              <Building className="mx-auto text-[#c9a84c]" size={28} />
              <div className="text-2xl font-extrabold text-[#1e3a5f]">BISE</div>
              <div className="text-xs text-gray-600 font-medium">
                {locale === "bn" ? "ঢাকা শিক্ষাবোর্ড অনুমোদিত" : "Dhaka Board Affiliated"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Section Preview */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">
              {locale === "bn" ? "আমাদের শিক্ষকবৃন্দ" : "Our Faculty & Teachers"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {locale === "bn"
                ? "যোগ্য ও অভিজ্ঞ শিক্ষকমণ্ডলী দ্বারা পরিচালিত"
                : "Dedicated educators guiding our students to success"}
            </p>
          </div>
          <Link
            href={`/${locale}/teachers`}
            className="btn-primary text-xs !py-2 !px-4"
          >
            {locale === "bn" ? "সকল শিক্ষক দেখুন" : "View All Faculty"}
          </Link>
        </div>

        {featuredTeachers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-center p-5 space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border-2 border-[#1e3a5f]/20">
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
                  <p className="text-xs text-gray-500 font-medium">
                    {locale === "bn"
                      ? teacher.designationBn || teacher.designationEn
                      : teacher.designationEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-amber-50 rounded-xl border border-amber-200 text-center space-y-2">
            <ShieldAlert className="mx-auto text-amber-600" size={24} />
            <p className="text-xs text-amber-800 font-medium">
              {locale === "bn"
                ? "শিক্ষক প্রোফাইলগুলো সরকারি ডাটাবেজ থেকে সংগৃহীত হয়েছে এবং বর্তমানে প্রশাসনিক অনুমোদনের অপেক্ষায় রয়েছে।"
                : "Teacher profiles are currently in PENDING_VERIFICATION state until approved by school authorities."}
            </p>
            <Link
              href={`/${locale}/teachers`}
              className="inline-block text-xs text-[#1e3a5f] font-bold underline"
            >
              {locale === "bn" ? "শিক্ষক তালিকা বিস্তারিত দেখুন" : "View Teacher Directory"}
            </Link>
          </div>
        )}
      </section>

      {/* Contact & Map Section */}
      <section className="container mx-auto px-4 pt-4">
        <div className="bg-[#1e3a5f] text-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                {locale === "bn" ? "যোগাযোগ ও তথ্য সহায়তা" : "Contact & Information Desk"}
              </h2>
              <p className="text-sm text-gray-200 leading-relaxed">
                {locale === "bn"
                  ? "বিদ্যালয়ের ভর্তি তথ্য, একাডেমিক কার্যক্রম অথবা যেকোনো প্রশ্নের জন্য সরাসরি যোগাযোগ করুন।"
                  : "For admissions, academic queries, or official correspondence, visit our campus or reach out via phone."}
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <p>📍 {profile?.addressBn || "মিল্কভিটা রোড, মিরপুর-৭, পল্লবী, ঢাকা-১২১৬"}</p>
                <p>📞 {profile?.phone || "+8801309108325"}</p>
                <p>✉️ {profile?.email || "info@pbn.edu.bd"}</p>
              </div>
              <div className="pt-2">
                <Link
                  href={`/${locale}/contact`}
                  className="bg-[#c9a84c] hover:bg-[#b8963e] text-[#1e3a5f] font-bold px-5 py-2.5 rounded-lg text-sm transition-all inline-block"
                >
                  {locale === "bn" ? "বার্তা পাঠান" : "Send an Inquiry"}
                </Link>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 border border-white/20 text-center flex flex-col items-center justify-center min-h-[180px]">
              <Building size={40} className="text-[#c9a84c] mb-2" />
              <h4 className="font-bold text-base">{schoolName}</h4>
              <p className="text-xs text-gray-300 mt-1">Mirpur-7, Pallabi, Dhaka</p>
              <a
                href="https://maps.google.com/?q=Pallabi+Bidyaniketan+Mirpur-7+Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-xs font-semibold bg-white text-[#1e3a5f] px-4 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
              >
                Google Maps &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
