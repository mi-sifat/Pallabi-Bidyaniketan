import { prisma } from "@/lib/prisma";
import { Download, Plus, FileText } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminDownloadsPage() {
  const downloads = await prisma.download.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function createDownload(formData: FormData) {
    "use server";
    const titleBn = formData.get("titleBn") as string;
    const category = formData.get("category") as string;
    const fileUrl = formData.get("fileUrl") as string;

    if (!titleBn || !fileUrl) return;

    await prisma.download.create({
      data: {
        titleBn,
        titleEn: titleBn,
        category: category || "General",
        fileUrl,
        isPublished: true,
        status: "PUBLISHED",
      },
    });

    revalidatePath("/admin/downloads");
    revalidatePath("/bn/downloads");
    revalidatePath("/en/downloads");
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
          ডাউনলোড ফাইল ও অফিসিয়াল ফরম ব্যবস্থাপনা
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          ভর্তি ফরম, পরীক্ষার রুটিন ও প্রাতিষ্ঠানিক ডকুমেন্টস যুক্ত করুন
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-2">
          নতুন ফাইল বা ফরম যোগ করুন
        </h2>

        <form action={createDownload} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">ফাইলের শিরোনাম *</label>
              <input
                type="text"
                name="titleBn"
                required
                placeholder="যেমন: ২০২৪ শিক্ষাবর্ষের ভর্তি ফরম"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">ক্যাটাগরি</label>
              <select name="category" className="form-input">
                <option value="Admission">ভর্তি ফরম (Admission)</option>
                <option value="Routine">ক্লাস / পরীক্ষা রুটিন</option>
                <option value="Syllabus">সিলেবাস (Syllabus)</option>
                <option value="Notice">অফিসিয়াল সার্কুলার</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">ফাইলের লিঙ্ক বা URL *</label>
            <input
              type="text"
              name="fileUrl"
              required
              placeholder="/uploads/admission_form.pdf অথবা অনলাইন ড্রাইভ লিঙ্ক"
              className="form-input"
            />
          </div>

          <button type="submit" className="btn-primary !text-xs !py-2">
            <Plus size={16} /> ফাইল যোগ করুন
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-2">
          সংরক্ষিত ফাইল তালিকা ({downloads.length})
        </h2>
        {downloads.length > 0 ? (
          <div className="space-y-3">
            {downloads.map((d) => (
              <div key={d.id} className="p-4 border rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-gray-900 text-sm">{d.titleBn}</span>
                  <span className="text-gray-400 ml-2">({d.category})</span>
                </div>
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  প্রকাশিত
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-4">কোনো ফাইল যুক্ত নেই।</p>
        )}
      </div>
    </div>
  );
}
