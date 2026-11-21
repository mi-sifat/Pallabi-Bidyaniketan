import { prisma } from "@/lib/prisma";
import { BookOpen, CheckCircle, Clock } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminAcademicsPage() {
  const classes = await prisma.academicClass.findMany({
    orderBy: { sortOrder: "asc" },
  });

  async function toggleClass(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const current = formData.get("current") === "true";
    await prisma.academicClass.update({
      where: { id },
      data: { isActive: !current },
    });
    revalidatePath("/admin/academics");
    revalidatePath("/bn/academics");
    revalidatePath("/en/academics");
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
          শ্রেণি বিন্যাস ও একাডেমিক ক্লাস ব্যবস্থাপনা
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          বিদ্যালয়ের চালু থাকা শ্রেণি ও শাখা সমূহের সক্রিয়করণ
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-2">
          শ্রেণি তালিকা
        </h2>

        <div className="space-y-3">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="p-4 rounded-xl border border-gray-200 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center font-bold">
                  {cls.level}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {cls.nameBn} ({cls.nameEn})
                  </h3>
                  <span className="text-gray-400">লেভেল: {cls.level}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {cls.isActive ? (
                  <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <CheckCircle size={12} /> ওয়েবসাইটে সক্রিয়
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Clock size={12} /> যাচাই প্রক্রিয়াধীন
                  </span>
                )}

                <form action={toggleClass}>
                  <input type="hidden" name="id" value={cls.id} />
                  <input type="hidden" name="current" value={String(cls.isActive)} />
                  <button
                    type="submit"
                    className={`text-[11px] font-bold px-3 py-1 rounded transition-colors ${
                      cls.isActive
                        ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {cls.isActive ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
