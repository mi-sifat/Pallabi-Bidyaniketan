import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Users,
  Bell,
  FileCheck2,
  ShieldAlert,
  Database,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    totalTeachers,
    pendingTeachers,
    publishedTeachers,
    totalNotices,
    pendingMigrations,
    messagesCount,
    profile,
  ] = await Promise.all([
    prisma.teacher.count({ where: { isArchived: false } }),
    prisma.teacher.count({ where: { isPublished: false, isArchived: false } }),
    prisma.teacher.count({ where: { isPublished: true, isArchived: false } }),
    prisma.notice.count(),
    prisma.migrationRecord.count({ where: { verificationStatus: "PENDING_VERIFICATION" } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.schoolProfile.findFirst(),
  ]);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome & Alert Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
            <Sparkles size={13} />
            EIIN: 108325 | পল্লবী, ঢাকা
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
            প্রশাসনিক ড্যাশবোর্ড (Admin Overview)
          </h1>
          <p className="text-xs text-gray-500">
            ওয়েবসাইটের তথ্যাদি যাচাইকরণ, শিক্ষক তালিকা এবং নোটিশ প্রকাশনা ব্যবস্থাপনা
          </p>
        </div>

        <Link
          href="/admin/verification"
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2 shrink-0 self-start sm:self-center"
        >
          <ShieldAlert size={16} />
          যাচাইকরণ কেন্দ্র ({pendingTeachers + pendingMigrations})
        </Link>
      </div>

      {/* Primary KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>মোট শিক্ষক রেকর্ড</span>
            <Users size={18} className="text-[#1e3a5f]" />
          </div>
          <div className="text-3xl font-extrabold text-[#1e3a5f]">
            {totalTeachers}
          </div>
          <div className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
            <span>{pendingTeachers} টি অনুমোদন অপেক্ষমান</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>অনুমোদিত শিক্ষক</span>
            <FileCheck2 size={18} className="text-green-600" />
          </div>
          <div className="text-3xl font-extrabold text-green-700">
            {publishedTeachers}
          </div>
          <div className="text-[11px] text-gray-500">
            ওয়েবসাইটে সক্রিয়ভাবে দৃশ্যমান
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>প্রকাশিত নোটিশ</span>
            <Bell size={18} className="text-[#c9a84c]" />
          </div>
          <div className="text-3xl font-extrabold text-gray-800">
            {totalNotices}
          </div>
          <div className="text-[11px] text-gray-500">
            সার্কুলার ও নোটিশ বোর্ড
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>মাইগ্রেশন রেকর্ড</span>
            <Database size={18} className="text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-purple-700">
            {pendingMigrations}
          </div>
          <div className="text-[11px] text-gray-500">
            শিক্ষা বোর্ড ও ওয়েব ডাটা
          </div>
        </div>
      </div>

      {/* Fast Action Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verification Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-[#1e3a5f] flex items-center gap-2">
              <ShieldAlert className="text-amber-500" size={18} />
              তথ্য যাচাইকরণ টাস্ক
            </h2>
            <Link
              href="/admin/verification"
              className="text-xs text-[#1e3a5f] font-bold hover:underline inline-flex items-center gap-1"
            >
              সবগুলো দেখুন <ArrowRight size={13} />
            </Link>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            ঢাকা শিক্ষা বোর্ডের ম্যানপাওয়ার ডাটাবেজ থেকে ১৮ জন শিক্ষক এবং ওয়েব রেকর্ড থেকে প্রাথমিক তথ্য ইমপোর্ট করা হয়েছে। স্কুল কর্তৃপক্ষের অনুমোদনের পর তথ্যগুলো প্রকাশ করা যাবে।
          </p>

          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-800">প্রাতিষ্ঠানিক তথ্যাদি (EIIN, সাল)</span>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">যাচাইযোগ্য</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-800">শিক্ষক ও স্টাফ তালিকা (২০ জন)</span>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">অনুমোদন অপেক্ষমান</span>
            </div>
          </div>
        </div>

        {/* Quick Management Links */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-3">
            দ্রুত অ্যাকশন (Quick Tasks)
          </h2>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <Link
              href="/admin/teachers"
              className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl font-semibold text-gray-800 transition-colors block text-center border border-gray-100"
            >
              👥 শিক্ষক তালিকা ও প্রকাশ
            </Link>
            <Link
              href="/admin/notices"
              className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl font-semibold text-gray-800 transition-colors block text-center border border-gray-100"
            >
              📢 নতুন নোটিশ প্রকাশ
            </Link>
            <Link
              href="/admin/settings"
              className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl font-semibold text-gray-800 transition-colors block text-center border border-gray-100"
            >
              ⚙️ স্কুল প্রোফাইল ও লোগো
            </Link>
            <Link
              href="/admin/migration"
              className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl font-semibold text-gray-800 transition-colors block text-center border border-gray-100"
            >
              🌐 মাইগ্রেশন হিস্টোরি
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
