import { prisma } from "@/lib/prisma";
import { Award, Plus, Calendar } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminResultsPage() {
  const results = await prisma.resultArchive.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function createResult(formData: FormData) {
    "use server";
    const titleBn = formData.get("titleBn") as string;
    const academicYear = formData.get("academicYear") as string;
    const examType = formData.get("examType") as string;
    const summaryBn = formData.get("summaryBn") as string;

    if (!titleBn || !academicYear) return;

    await prisma.resultArchive.create({
      data: {
        titleBn,
        titleEn: titleBn,
        academicYear,
        examType: examType || "SSC",
        summaryBn,
        isPublished: true,
        status: "PUBLISHED",
        verificationStatus: "VERIFIED",
      },
    });

    revalidatePath("/admin/results");
    revalidatePath("/bn/results");
    revalidatePath("/en/results");
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
          ফলাফল প্রকাশ ও আর্কাইভ
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          বোর্ড ও বিদ্যালয় অভ্যন্তরীণ পরীক্ষার ফলাফল প্রকাশনা
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-2">
          নতুন ফলাফল এন্ট্রি করুন
        </h2>

        <form action={createResult} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="form-label">পরীক্ষার শিরোনাম *</label>
              <input
                type="text"
                name="titleBn"
                required
                placeholder="যেমন: এসএসসি পরীক্ষা ২০২৩ ফলাফল"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">শিক্ষাবর্ষ (Year) *</label>
              <input
                type="text"
                name="academicYear"
                required
                placeholder="2024"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">পরীক্ষার ধরন</label>
              <select name="examType" className="form-input">
                <option value="SSC">SSC (মাধ্যমিক)</option>
                <option value="Annual">বার্ষিক পরীক্ষা</option>
                <option value="Pre-Test">প্রাক-নির্বাচনী</option>
                <option value="Test">নির্বাচনী পরীক্ষা</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">ফলাফল সংক্ষেপ / নোট</label>
            <textarea
              name="summaryBn"
              rows={2}
              placeholder="পাস ও গ্রেড পরিসংখ্যান..."
              className="form-input"
            />
          </div>

          <button type="submit" className="btn-primary !text-xs !py-2">
            <Plus size={16} /> ফলাফল প্রকাশ করুন
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-2">
          সংরক্ষিত ফলাফল ({results.length})
        </h2>
        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map((r) => (
              <div key={r.id} className="p-4 border rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-gray-900 text-sm">{r.titleBn}</span>
                  <span className="text-gray-400 ml-2">({r.academicYear} | {r.examType})</span>
                </div>
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  প্রকাশিত
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-4">কোনো ফলাফল এন্ট্রি নেই।</p>
        )}
      </div>
    </div>
  );
}
