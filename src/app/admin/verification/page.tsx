import { prisma } from "@/lib/prisma";
import { ShieldCheck, AlertCircle, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function VerificationDashboardPage() {
  const [profile, pendingTeachers, unverifiedMigrations] = await Promise.all([
    prisma.schoolProfile.findFirst(),
    prisma.teacher.findMany({
      where: { isPublished: false, isArchived: false },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.migrationRecord.findMany({
      where: { verificationStatus: "PENDING_VERIFICATION" },
    }),
  ]);

  // Server actions for approving items
  async function approveTeacher(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    await prisma.teacher.update({
      where: { id },
      data: {
        isPublished: true,
        verificationStatus: "VERIFIED",
        status: "PUBLISHED",
      },
    });
    revalidatePath("/admin/verification");
    revalidatePath("/admin/teachers");
    revalidatePath("/bn/teachers");
    revalidatePath("/en/teachers");
  }

  async function approveAllTeachers() {
    "use server";
    await prisma.teacher.updateMany({
      where: { isPublished: false, isArchived: false },
      data: {
        isPublished: true,
        verificationStatus: "VERIFIED",
        status: "PUBLISHED",
      },
    });
    revalidatePath("/admin/verification");
    revalidatePath("/admin/teachers");
    revalidatePath("/bn/teachers");
    revalidatePath("/en/teachers");
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
            কন্টেন্ট ভেরিফিকেশন ও অনুমোদন কেন্দ্র (Content Verification)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            সরকারি ও ঐতিহাসিক উৎস থেকে সংগৃহীত তথ্যাদি যাচাই এবং ওয়েবসাইটে প্রকাশের অনুমোদন
          </p>
        </div>

        {pendingTeachers.length > 0 && (
          <form action={approveAllTeachers}>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 size={16} />
              সকল শিক্ষক অনুমোদন ও প্রকাশ করুন ({pendingTeachers.length})
            </button>
          </form>
        )}
      </div>

      {/* Institutional Core Facts Verification */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-3 flex items-center gap-2">
          <ShieldCheck className="text-[#c9a84c]" size={20} />
          ১. প্রাতিষ্ঠানিক মৌলিক তথ্য যাচাই
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <th className="p-3">তথ্য আইটেম (Field)</th>
                <th className="p-3">সংগৃহীত মান (Value)</th>
                <th className="p-3">তথ্যসূত্র (Source)</th>
                <th className="p-3">বর্তমান স্থিতি</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-3 font-semibold text-gray-800">অফিসিয়াল নাম (ইংরেজি)</td>
                <td className="p-3 font-bold text-[#1e3a5f]">{profile?.nameEn}</td>
                <td className="p-3 text-gray-500">BISE ঢাকা পোর্টাল (EIIN 108325)</td>
                <td className="p-3">
                  <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    নিশ্চিত
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-gray-800">অফিসিয়াল নাম (বাংলা)</td>
                <td className="p-3 font-bold text-[#1e3a5f]">{profile?.nameBn}</td>
                <td className="p-3 text-gray-500">বোর্ড ডাটা ও স্কুল নামফলক</td>
                <td className="p-3">
                  <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    নিশ্চিত
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-gray-800">EIIN নম্বর</td>
                <td className="p-3 font-bold text-gray-900">{profile?.eiin}</td>
                <td className="p-3 text-gray-500">শিক্ষা বোর্ড অফিশিয়াল কোড</td>
                <td className="p-3">
                  <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    নিশ্চিত
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-gray-800">প্রতিষ্ঠা তারিখ</td>
                <td className="p-3 text-gray-700">{profile?.establishedDate || "০১ জানুয়ারি ১৯৭৭"}</td>
                <td className="p-3 text-gray-500">পূর্ববর্তী ওয়েব রেকর্ড (pbn.edu.bd)</td>
                <td className="p-3">
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    যাচাই প্রক্রিয়াধীন
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-gray-800">প্রথম এমপিও অন্তর্ভুক্তি</td>
                <td className="p-3 text-gray-700">{profile?.firstMpoDate || "০১ মে ২০১০"}</td>
                <td className="p-3 text-gray-500">পূর্ববর্তী ওয়েব রেকর্ড</td>
                <td className="p-3">
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    যাচাই প্রক্রিয়াধীন
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Teachers Verification List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-3 flex items-center justify-between">
          <span>২. শিক্ষক প্রোফাইল ভেরিফিকেশন ও প্রকাশনা ({pendingTeachers.length} জন অপেক্ষমান)</span>
        </h2>

        {pendingTeachers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
                  <th className="p-3">ক্রম</th>
                  <th className="p-3">শিক্ষকের নাম</th>
                  <th className="p-3">পদবী</th>
                  <th className="p-3">তথ্যসূত্র</th>
                  <th className="p-3 text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingTeachers.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-500">{idx + 1}</td>
                    <td className="p-3 font-bold text-gray-900">{t.nameEn}</td>
                    <td className="p-3 text-gray-600">{t.designationEn}</td>
                    <td className="p-3 text-gray-400 text-[11px]">{t.sourceReference || "DEB Portal"}</td>
                    <td className="p-3 text-right">
                      <form action={approveTeacher} className="inline">
                        <input type="hidden" name="id" value={t.id} />
                        <button
                          type="submit"
                          className="bg-[#1e3a5f] hover:bg-[#2a5298] text-white text-[11px] font-bold px-3 py-1 rounded transition-colors"
                        >
                          অনুমোদন ও প্রকাশ
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-green-700 bg-green-50 rounded-xl font-medium">
            ✅ সকল শিক্ষক প্রোফাইল সফলভাবে যাচাই এবং ওয়েবসাইটে প্রকাশিত হয়েছে!
          </div>
        )}
      </div>
    </div>
  );
}
