export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import HomepageSlider from "@/components/public/HomepageSlider";
import NoticeTicker from "@/components/public/NoticeTicker";
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
  MapPin,
  Image as GalleryIcon,
  Newspaper,
} from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };

  // Fetch published data from DB
  const [
    profile,
    slides,
    notices,
    newsList,
    events,
    featuredTeachers,
    recentAlbums,
  ] = await Promise.all([
    prisma.schoolProfile.findFirst(),
    prisma.homepageSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
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
    prisma.schoolEvent.findMany({
      where: { isPublished: true },
      include: { album: true },
      orderBy: { eventDate: "desc" },
      take: 3,
    }),
    prisma.teacher.findMany({
      where: { isPublished: true, isArchived: false },
      orderBy: { displayOrder: "asc" },
      take: 4,
    }),
    prisma.galleryAlbum.findMany({
      where: { isPublished: true },
      include: { images: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const schoolName =
    locale === "bn"
      ? profile?.nameBn || "পল্লবী বিদ্যানিকেতন"
      : profile?.nameEn || "Pallabi Bidyaniketan";

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Homepage Slider */}
      <HomepageSlider slides={slides} locale={locale} />

      {/* 2. Notice Scroller / Urgent Notice Ticker */}
      <section className="container mx-auto px-4 -mt-8 relative z-30">
        <NoticeTicker notices={notices} locale={locale} />
      </section>

      {/* 3. Welcome / School Intro & Headmaster's Message */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* School Intro */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#1e3a5f] text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
              <Sparkles size={13} className="text-[#c9a84c]" />
              {locale === "bn" ? "ঐতিহ্য ও উৎকর্ষ" : "Tradition & Excellence"}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] leading-snug">
              {locale === "bn"
                ? `স্বাগতম ${schoolName} এ`
                : `Welcome to ${schoolName}`}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {locale === "bn"
                ? "পল্লবী বিদ্যানিকেতন মিরপুর-৭, ঢাকায় অবস্থিত একটি আধুনিক, মানসম্মত এবং ঐতিহ্যবাহী মাধ্যমিক শিক্ষাপ্রতিষ্ঠান। ১৯৭৭ সালে প্রতিষ্ঠিত এই বিদ্যাপীঠ দীর্ঘ চার দশকের অধিক সময় ধরে দক্ষ শিক্ষকমণ্ডলী ও যুগোপযোগী পাঠ্যসূচির মাধ্যমে শিক্ষার্থীদের জ্ঞান, সততা, সৃজনশীলতা ও মানবিক মূল্যবোধে ভবিষ্যৎ প্রজন্ম হিসেবে গড়ে তুলছে।"
                : "Pallabi Bidyaniketan is a distinguished secondary educational institution situated in Mirpur-7, Dhaka. Established in 1977, the school has been dedicated to cultivating academic rigor, discipline, and moral character in young minds for over four decades."}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <div className="text-lg font-black text-[#1e3a5f]">১০৮৩২৫</div>
                <div className="text-[10px] text-gray-500 font-medium">অফিসিয়াল EIIN</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <div className="text-lg font-black text-[#c9a84c]">১৯৭৭</div>
                <div className="text-[10px] text-gray-500 font-medium">প্রতিষ্ঠা সাল</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center col-span-2 sm:col-span-1">
                <div className="text-lg font-black text-[#1e3a5f]">মাধ্যমিক</div>
                <div className="text-[10px] text-gray-500 font-medium">ঢাকা শিক্ষাবোর্ড</div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/${locale}/about`}
                className="text-xs font-bold text-[#1e3a5f] hover:text-[#c9a84c] inline-flex items-center gap-1.5"
              >
                {locale === "bn" ? "বিদ্যালয় সম্পর্কে আরও জানুন" : "Read More About Us"} &rarr;
              </Link>
            </div>
          </div>

          {/* Headmaster Message Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Building className="text-[#c9a84c]" size={20} />
              <h3 className="text-base font-bold text-[#1e3a5f]">
                {locale === "bn" ? "প্রধান শিক্ষকের বাণী" : "Headmaster's Message"}
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-20 h-24 rounded-2xl bg-amber-50 overflow-hidden border-2 border-[#1e3a5f]/30 shrink-0 shadow-sm relative">
                <Image
                  src="/uploads/teachers/MD_SHAHE_ALAM.jpg"
                  alt={locale === "bn" ? "মোঃ শাহে আলম" : "MD. SHAHE ALAM"}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  {locale === "bn" ? "মোঃ শাহে আলম" : "MD. SHAHE ALAM"}
                </h4>
                <p className="text-xs text-gray-500 font-medium">
                  {locale === "bn" ? "প্রধান শিক্ষক" : "Headmaster"}
                </p>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold inline-block mt-1 border border-emerald-200">
                  {locale === "bn" ? "পল্লবী বিদ্যানিকেতন" : "Pallabi Bidyaniketan"}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic border-l-2 border-[#c9a84c] pl-3">
              {locale === "bn"
                ? "“পল্লবী বিদ্যানিকেতন প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভার বিকাশ ও দেশপ্রেমিক সুনাগরিক হিসেবে গড়ে তুলতে নিরলস কাজ করে যাচ্ছে। আমাদের লক্ষ্য আধুনিক প্রযুক্তিনির্ভর ও মূল্যবোধভিত্তিক শিক্ষাদান।”"
                : "“Pallabi Bidyaniketan is continuously striving to nurture each student's inherent potential, guiding them to become enlightened and patriotic citizens.”"}
            </p>

            <Link
              href={`/${locale}/headmaster-message`}
              className="text-xs font-bold text-[#1e3a5f] hover:text-[#c9a84c] inline-block pt-1 transition-colors"
            >
              {locale === "bn" ? "বাণী সম্পূর্ণ পড়ুন" : "Read Full Message"} &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Upcoming Events Section */}
      {events.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-3">
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
                <Calendar size={22} className="text-[#c9a84c]" />
                {locale === "bn" ? "আসন্ন ইভেন্ট ও অনুষ্ঠান" : "Upcoming Events & Activities"}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {locale === "bn"
                  ? "বার্ষিক ক্রীড়া, সাংস্কৃতিক উৎসব ও জাতীয় দিবসের কার্যক্রম"
                  : "Annual sports, celebrations and extracurricular calendar"}
              </p>
            </div>
            <Link
              href={`/${locale}/events`}
              className="text-xs font-bold text-[#1e3a5f] hover:text-[#c9a84c] inline-flex items-center gap-1"
            >
              {locale === "bn" ? "সকল ইভেন্ট" : "View All"} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {ev.coverImageUrl ? (
                    <div className="relative h-44 overflow-hidden bg-gray-100">
                      <Image
                        src={ev.coverImageUrl}
                        alt={ev.titleBn || ev.titleEn}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        quality={80}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 right-3 bg-[#1e3a5f]/85 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs z-10">
                        {ev.category}
                      </span>
                    </div>
                  ) : (
                    <div className="h-28 bg-blue-50 flex items-center justify-center text-blue-300">
                      <Calendar size={32} />
                    </div>
                  )}

                  <div className="p-4 space-y-2">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                      <Calendar size={12} className="text-[#c9a84c]" />
                      {ev.eventDate
                        ? new Date(ev.eventDate).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                        : "তারিখ নির্ধারিত নয়"}
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-[#1e3a5f] transition-colors">
                      {locale === "bn" ? ev.titleBn || ev.titleEn : ev.titleEn}
                    </h3>
                    {ev.descriptionBn && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {locale === "bn" ? ev.descriptionBn : ev.descriptionEn || ev.descriptionBn}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/${locale}/events/${ev.slug}`}
                    className="text-xs font-bold text-[#1e3a5f] hover:text-[#c9a84c] inline-flex items-center gap-1 pt-2"
                  >
                    {locale === "bn" ? "বিস্তারিত দেখুন" : "View Details"} &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Photo Gallery Preview */}
      {recentAlbums.length > 0 && (
        <section className="bg-gray-50 py-12 border-y border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-3">
              <div>
                <h2 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
                  <GalleryIcon size={22} className="text-[#c9a84c]" />
                  {locale === "bn" ? "ফটো গ্যালারি চিত্রশালা" : "Photo Gallery Highlights"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {locale === "bn"
                    ? "ক্যাম্পাস স্মৃতি, ক্রীড়া প্রতিযোগিতা ও সাংস্কৃতিক অনুষ্ঠানের স্মরণীয় মুহূর্ত"
                    : "Capturing memorable moments, festivities, and student achievements"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/${locale}/gallery/all`}
                  className="text-xs font-bold text-gray-600 hover:text-[#1e3a5f]"
                >
                  {locale === "bn" ? "সকল ছবি" : "All Photos"}
                </Link>
                <Link
                  href={`/${locale}/gallery`}
                  className="text-xs font-bold text-[#1e3a5f] hover:text-[#c9a84c] inline-flex items-center gap-1"
                >
                  {locale === "bn" ? "সকল অ্যালবাম" : "All Albums"} &rarr;
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {recentAlbums.map((album) => (
                <Link
                  key={album.id}
                  href={`/${locale}/gallery/${album.slug}`}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all group block"
                >
                  <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
                    {album.coverImageUrl ? (
                      <Image
                        src={album.coverImageUrl}
                        alt={album.titleBn || album.titleEn}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        quality={80}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <GalleryIcon size={28} />
                      </div>
                    )}
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs z-10">
                      {album.images.length} ছবি
                    </span>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-gray-900 text-xs truncate group-hover:text-[#1e3a5f]">
                      {locale === "bn" ? album.titleBn || album.titleEn : album.titleEn}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Recent News & Blog Section */}
      {newsList.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-3">
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
                <Newspaper size={22} className="text-[#c9a84c]" />
                {locale === "bn" ? "সংবাদ ও সাম্প্রতিক তথ্য" : "News & Recent Articles"}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {locale === "bn"
                  ? "বিদ্যালয়ের সাফল্য ও শিক্ষার্থীদের অর্জনের তথ্য"
                  : "Latest school achievements and event recaps"}
              </p>
            </div>
            <Link
              href={`/${locale}/news`}
              className="text-xs font-bold text-[#1e3a5f] hover:text-[#c9a84c] inline-flex items-center gap-1"
            >
              {locale === "bn" ? "সকল সংবাদ" : "All News"} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsList.map((item) => {
              const tr = item.translations.find((t) => t.locale === locale) || item.translations[0];
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {item.coverImageUrl && (
                      <div className="relative h-44 overflow-hidden bg-gray-100">
                        <Image
                          src={item.coverImageUrl}
                          alt={tr?.title || "News"}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          quality={80}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-5 space-y-2">
                      <span className="text-[11px] text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US")}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-[#1e3a5f]">
                        {tr?.title}
                      </h3>
                      {tr?.excerpt && (
                        <p className="text-xs text-gray-600 line-clamp-3">
                          {tr.excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      href={`/${locale}/news/${item.slug}`}
                      className="text-xs font-bold text-[#1e3a5f] hover:text-[#c9a84c] inline-flex items-center gap-1"
                    >
                      {locale === "bn" ? "বিস্তারিত পড়ুন" : "Read More"} &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 7. Faculty & Teachers Highlight */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
              <Users size={22} className="text-[#c9a84c]" />
              {locale === "bn" ? "আমাদের শিক্ষকমণ্ডলী" : "Faculty & Educators"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {locale === "bn"
                ? "অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষকবৃন্দের তত্ত্বাবধানে পাঠদান"
                : "Dedicated educators guiding our students towards excellence"}
            </p>
          </div>
          <Link
            href={`/${locale}/teachers`}
            className="text-xs font-bold text-[#1e3a5f] hover:text-[#c9a84c] inline-flex items-center gap-1"
          >
            {locale === "bn" ? "সকল শিক্ষক দেখুন" : "View All Faculty"} &rarr;
          </Link>
        </div>

        {featuredTeachers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featuredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-2xl shadow-2xs border border-gray-200 overflow-hidden text-center p-4 space-y-3 hover:shadow-md transition-shadow group"
              >
                <div className="w-28 h-36 mx-auto rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center border-2 border-[#1e3a5f]/20 shadow-xs relative group-hover:border-[#c9a84c] transition-colors">
                  {teacher.photoUrl ? (
                    <Image
                      src={teacher.photoUrl}
                      alt={teacher.nameEn}
                      fill
                      sizes="112px"
                      quality={85}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#1e3a5f] font-bold text-sm bg-amber-50">
                      {teacher.nameEn.slice(0, 1)}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-[#1e3a5f] transition-colors">
                    {locale === "bn" ? teacher.nameBn || teacher.nameEn : teacher.nameEn}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {locale === "bn"
                      ? teacher.designationBn || teacher.designationEn
                      : teacher.designationEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-amber-50 rounded-xl border border-amber-200 text-center space-y-1">
            <p className="text-xs text-amber-800 font-medium">
              {locale === "bn"
                ? "শিক্ষক প্রোফাইলগুলো বর্তমানে প্রশাসনিক অনুমোদনের অপেক্ষায় রয়েছে।"
                : "Teacher profiles are pending approval."}
            </p>
          </div>
        )}
      </section>

      {/* 8. Contact & Location Map */}
      <section className="container mx-auto px-4">
        <div className="bg-[#1e3a5f] text-white rounded-3xl p-8 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                {locale === "bn" ? "যোগাযোগ ও তথ্য সহায়তা" : "Contact & Information"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                {locale === "bn"
                  ? "বিদ্যালয়ের নতুন ভর্তি, একাডেমিক কার্যক্রম অথবা যেকোনো তথ্যের জন্য সরাসরি আমাদের ক্যাম্পাসে আসুন বা যোগাযোগ করুন।"
                  : "For admissions, academic queries, or official correspondence, reach out or visit our campus."}
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-gray-300">
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#c9a84c] shrink-0" />
                  <span>{profile?.addressBn || "মিল্কভিটা রোড, মিরপুর-৭, পল্লবী, ঢাকা-১২১৬"}</span>
                </p>
                <p>📞 {profile?.phone || "+8801309108325"}</p>
                <p>✉️ {profile?.email || "info@pallabibidyaniketan.edu.bd"}</p>
              </div>
              <div className="pt-2">
                <Link
                  href={`/${locale}/contact`}
                  className="bg-[#c9a84c] hover:bg-amber-400 text-[#1e3a5f] font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all inline-block shadow-md"
                >
                  {locale === "bn" ? "সরাসরি বার্তা পাঠান" : "Send Inquiry"}
                </Link>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/20 shadow-lg h-64 sm:h-72 w-full bg-slate-800">
              <iframe
                src="https://maps.google.com/maps?q=Pallabi+Bidyaniketan,+Mirpur-7,+Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Pallabi Bidyaniketan Campus Map"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
