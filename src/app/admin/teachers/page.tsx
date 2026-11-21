import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Plus, CheckCircle, Clock } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminTeachersPage() {
  const teachers = await prisma.teacher.findMany({
    where: { isArchived: false },
    orderBy: { displayOrder: "asc" },
  });

  async function togglePublish(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const current = formData.get("current") === "true";
    await prisma.teacher.update({
      where: { id },
      data: {
        isPublished: !current,
        status: !current ? "PUBLISHED" : "PENDING_VERIFICATION",
      },
    });
    revalidatePath("/admin/teachers");
    revalidatePath("/bn/teachers");
    revalidatePath("/en/teachers");
    revalidatePath("/bn");
    revalidatePath("/en");
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
            শিক্ষক ও কর্মকর্তা ব্যবস্থাপনা ({teachers.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            শিক্ষক প্রোফাইল প্রকাশনা নিয়ন্ত্রণ, পদবী ও বিস্তারিত তথ্য সম্পাদনা
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-semibold">
                <th className="p-3.5">ক্রম</th>
                <th className="p-3.5">শিক্ষকের নাম</th>
                <th className="p-3.5">পদবী (Designation)</th>
                <th className="p-3.5">উৎস (Source)</th>
                <th className="p-3.5 text-center">ওয়েবসাইট স্থিতি</th>
                <th className="p-3.5 text-right">টগল অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teachers.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/80">
                  <td className="p-3.5 font-bold text-gray-400">{t.displayOrder}</td>
                  <td className="p-3.5 font-bold text-gray-900">{t.nameEn}</td>
                  <td className="p-3.5 text-gray-600">{t.designationEn}</td>
                  <td className="p-3.5 text-gray-400 text-[11px]">{t.sourceReference || "DEB"}</td>
                  <td className="p-3.5 text-center">
                    {t.isPublished ? (
                      <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <CheckCircle size={11} /> প্রকাশিত
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Clock size={11} /> পেন্ডিং
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <form action={togglePublish} className="inline">
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="current" value={String(t.isPublished)} />
                      <button
                        type="submit"
                        className={`text-[11px] font-bold px-3 py-1 rounded transition-colors ${
                          t.isPublished
                            ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {t.isPublished ? "আনপাবলিশ করুন" : "পাবলিশ করুন"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
