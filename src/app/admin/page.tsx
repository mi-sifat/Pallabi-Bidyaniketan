import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Users,
  Bell,
  FileCheck2,
  ShieldAlert,
  Sliders,
  Megaphone,
  Calendar,
  Image as GalleryIcon,
  Newspaper,
  FolderOpen,
  Settings,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    totalTeachers,
    publishedTeachers,
    totalSlides,
    activePopup,
    totalEvents,
    totalAlbums,
    totalNews,
    totalNotices,
    totalMedia,
    profile,
  ] = await Promise.all([
    prisma.teacher.count({ where: { isArchived: false } }),
    prisma.teacher.count({ where: { isPublished: true, isArchived: false } }),
    prisma.homepageSlide.count({ where: { isActive: true } }),
    prisma.announcementPopup.findFirst({ where: { isActive: true } }),
    prisma.schoolEvent.count(),
    prisma.galleryAlbum.count(),
    prisma.news.count(),
    prisma.notice.count(),
    prisma.media.count(),
    prisma.schoolProfile.findFirst(),
  ]);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome & Alert Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
            <Sparkles size={13} />
            EIIN: 108325 | পল্লবী, ঢাকা-১২১৬
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
            প্রশাসনিক নিয়ন্ত্রণ কেন্দ্র (Admin Dashboard)
          </h1>
          <p className="text-xs text-gray-500">
            পল্লবী বিদ্যানিকেতন — সহজ ও সমন্বিত কনটেন্ট ম্যানেজমেন্ট সিস্টেম
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/bn"
            target="_blank"
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-bold text-xs px-3.5 py-2.5 rounded-lg shadow-2xs transition-all flex items-center gap-1.5"
          >
            <ExternalLink size={14} />
            মূল ওয়েবসাইট দেখুন
          </Link>
          <Link
            href="/admin/settings"
            className="bg-[#1e3a5f] hover:bg-[#2b5182] text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-all flex items-center gap-1.5"
          >
            <Settings size={14} />
            স্কুল সেটিংস
          </Link>
        </div>
      </div>

      {/* Primary KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <Link
          href="/admin/teachers"
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:shadow-sm transition-all space-y-1 group"
        >
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>শিক্ষকবৃন্দ</span>
            <Users size={16} className="text-[#1e3a5f] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-[#1e3a5f]">{totalTeachers}</div>
          <div className="text-[10px] text-green-700 font-medium">{publishedTeachers} জন প্রকাশিত</div>
        </Link>

        <Link
          href="/admin/homepage-slider"
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:shadow-sm transition-all space-y-1 group"
        >
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>স্লাইডার</span>
            <Sliders size={16} className="text-[#c9a84c] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700">{totalSlides}</div>
          <div className="text-[10px] text-gray-500">হোম ব্যানার সক্রিয়</div>
        </Link>

        <Link
          href="/admin/announcement-popup"
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:shadow-sm transition-all space-y-1 group"
        >
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>পপ-আপ ঘোষণা</span>
            <Megaphone size={16} className="text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-purple-800">{activePopup ? "১" : "০"}</div>
          <div className="text-[10px] text-gray-500">{activePopup ? "সক্রিয় রয়েছে" : "নিষ্ক্রিয়"}</div>
        </Link>

        <Link
          href="/admin/events"
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:shadow-sm transition-all space-y-1 group"
        >
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>ইভেন্ট সূচি</span>
            <Calendar size={16} className="text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-blue-700">{totalEvents}</div>
          <div className="text-[10px] text-gray-500">অনুষ্ঠান ও ক্রীড়া</div>
        </Link>

        <Link
          href="/admin/gallery"
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:shadow-sm transition-all space-y-1 group"
        >
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>ফটো গ্যালারি</span>
            <GalleryIcon size={16} className="text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-rose-700">{totalAlbums}</div>
          <div className="text-[10px] text-gray-500">অ্যালবাম সংরক্ষিত</div>
        </Link>

        <Link
          href="/admin/media"
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:shadow-sm transition-all space-y-1 group"
        >
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>মিডিয়া ফাইল</span>
            <FolderOpen size={16} className="text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{totalMedia}</div>
          <div className="text-[10px] text-gray-500">ছবি ও ডকুমেন্টস</div>
        </Link>
      </div>

      {/* Fast Action Quick Cards */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f]">
          প্রধান কনটেন্ট ব্যবস্থাপনা মডিউল (Quick Navigation)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <Link
            href="/admin/homepage-slider"
            className="p-4 bg-white hover:bg-blue-50/50 rounded-xl border border-gray-200 shadow-2xs hover:border-[#1e3a5f] transition-all flex items-start gap-3 group"
          >
            <div className="p-2.5 rounded-lg bg-blue-100/70 text-[#1e3a5f] shrink-0">
              <Sliders size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#1e3a5f] text-sm">
                হোমপেজ স্লাইডার (Hero Slider)
              </h3>
              <p className="text-gray-500 text-[11px] mt-0.5">
                ওয়েবসাইটের মূল ব্যানারের ছবি, শিরোনাম ও বাটন পরিবর্তন করুন
              </p>
            </div>
          </Link>

          <Link
            href="/admin/announcement-popup"
            className="p-4 bg-white hover:bg-amber-50/50 rounded-xl border border-gray-200 shadow-2xs hover:border-amber-500 transition-all flex items-start gap-3 group"
          >
            <div className="p-2.5 rounded-lg bg-amber-100/70 text-amber-900 shrink-0">
              <Megaphone size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-amber-800 text-sm">
                ঘোষণা পপ-আপ (Popup Alert)
              </h3>
              <p className="text-gray-500 text-[11px] mt-0.5">
                নতুন ভর্তি বিজ্ঞপ্তি বা জরুরি নোটিশ ওয়েবসাইটে পপ-আপ হিসেবে দেখান
              </p>
            </div>
          </Link>

          <Link
            href="/admin/media"
            className="p-4 bg-white hover:bg-emerald-50/50 rounded-xl border border-gray-200 shadow-2xs hover:border-emerald-600 transition-all flex items-start gap-3 group"
          >
            <div className="p-2.5 rounded-lg bg-emerald-100/70 text-emerald-800 shrink-0">
              <FolderOpen size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-emerald-800 text-sm">
                মিডিয়া লাইব্রেরি (Media Library)
              </h3>
              <p className="text-gray-500 text-[11px] mt-0.5">
                ড্র্যাগ-অ্যান্ড-ড্রপ করে ছবি আপলোড ও ফাইল সংরক্ষণ করুন
              </p>
            </div>
          </Link>

          <Link
            href="/admin/teachers"
            className="p-4 bg-white hover:bg-blue-50/50 rounded-xl border border-gray-200 shadow-2xs hover:border-[#1e3a5f] transition-all flex items-start gap-3 group"
          >
            <div className="p-2.5 rounded-lg bg-indigo-100/70 text-indigo-800 shrink-0">
              <Users size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#1e3a5f] text-sm">
                শিক্ষক ও কর্মকর্তা (Teachers)
              </h3>
              <p className="text-gray-500 text-[11px] mt-0.5">
                শিক্ষক তালিকা, ছবি, পদবী ও ওয়েবসাইটে দৃশ্যমানতা নিয়ন্ত্রণ করুন
              </p>
            </div>
          </Link>

          <Link
            href="/admin/events"
            className="p-4 bg-white hover:bg-purple-50/50 rounded-xl border border-gray-200 shadow-2xs hover:border-purple-600 transition-all flex items-start gap-3 group"
          >
            <div className="p-2.5 rounded-lg bg-purple-100/70 text-purple-800 shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-purple-800 text-sm">
                ইভেন্ট ও অনুষ্ঠান (Events)
              </h3>
              <p className="text-gray-500 text-[11px] mt-0.5">
                বার্ষিক ক্রীড়া, সাংস্কৃতিক ও জাতীয় দিবস আয়োজনের তারিখ ও ছবি প্রকাশ
              </p>
            </div>
          </Link>

          <Link
            href="/admin/gallery"
            className="p-4 bg-white hover:bg-rose-50/50 rounded-xl border border-gray-200 shadow-2xs hover:border-rose-600 transition-all flex items-start gap-3 group"
          >
            <div className="p-2.5 rounded-lg bg-rose-100/70 text-rose-800 shrink-0">
              <GalleryIcon size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-rose-800 text-sm">
                ফটো গ্যালারি (Gallery Albums)
              </h3>
              <p className="text-gray-500 text-[11px] mt-0.5">
                ক্যাম্পাস স্মৃতি ও বিভিন্ন অনুষ্ঠানভিত্তিক ফটো অ্যালবাম পরিচালনা
              </p>
            </div>
          </Link>

          <Link
            href="/admin/news"
            className="p-4 bg-white hover:bg-sky-50/50 rounded-xl border border-gray-200 shadow-2xs hover:border-sky-600 transition-all flex items-start gap-3 group"
          >
            <div className="p-2.5 rounded-lg bg-sky-100/70 text-sky-800 shrink-0">
              <Newspaper size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-sky-800 text-sm">
                সংবাদ ও ব্লগ (News & Blog)
              </h3>
              <p className="text-gray-500 text-[11px] mt-0.5">
                বিদ্যালয়ের সাফল্য, বিশেষ খবর ও শিক্ষামূলক ব্লগ আর্টিকেল প্রকাশ
              </p>
            </div>
          </Link>

          <Link
            href="/admin/notices"
            className="p-4 bg-white hover:bg-amber-50/50 rounded-xl border border-gray-200 shadow-2xs hover:border-amber-600 transition-all flex items-start gap-3 group"
          >
            <div className="p-2.5 rounded-lg bg-amber-100/70 text-amber-800 shrink-0">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-amber-800 text-sm">
                নোটিশ বোর্ড (Notices)
              </h3>
              <p className="text-gray-500 text-[11px] mt-0.5">
                পরীক্ষা, ছুটি ও দাপ্তরিক নোটিশ ও সার্কুলার পিডিএফ ফাইলসহ প্রকাশ
              </p>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="p-4 bg-white hover:bg-gray-100 rounded-xl border border-gray-200 shadow-2xs hover:border-gray-400 transition-all flex items-start gap-3 group"
          >
            <div className="p-2.5 rounded-lg bg-gray-100 text-gray-800 shrink-0">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">
                প্রতিষ্ঠান সেটিংস (School Settings)
              </h3>
              <p className="text-gray-500 text-[11px] mt-0.5">
                স্কুলের নাম, লোগো, ঠিকানা, ফোন, ফেসবুক ও সোশ্যাল লিংক আপডেট
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
