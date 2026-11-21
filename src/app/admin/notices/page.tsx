import { prisma } from "@/lib/prisma";
import { Bell, Plus, Calendar, Download } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminNoticesPage() {
  const notices = await prisma.notice.findMany({
    include: { translations: true },
    orderBy: { createdAt: "desc" },
  });

  async function createNotice(formData: FormData) {
    "use server";
    const titleBn = formData.get("titleBn") as string;
    const titleEn = formData.get("titleEn") as string;
    const contentBn = formData.get("contentBn") as string;
    const isImportant = formData.get("isImportant") === "on";

    if (!titleBn && !titleEn) return;

    const slug = `notice-${Date.now()}`;

    await prisma.notice.create({
      data: {
        slug,
        isImportant,
        isPublished: true,
        status: "PUBLISHED",
        translations: {
          create: [
            ...(titleBn ? [{ locale: "bn", title: titleBn, content: contentBn }] : []),
            ...(titleEn ? [{ locale: "en", title: titleEn, content: contentBn }] : []),
          ],
        },
      },
    });

    revalidatePath("/admin/notices");
    revalidatePath("/bn/notices");
    revalidatePath("/en/notices");
    revalidatePath("/bn");
    revalidatePath("/en");
  }

  async function deleteNotice(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    await prisma.notice.delete({ where: { id } });
    revalidatePath("/admin/notices");
    revalidatePath("/bn/notices");
    revalidatePath("/en/notices");
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
          নোটিশ প্রকাশনা ও ব্যবস্থাপনা
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          বিদ্যালয়ের জরুরি ঘোষণা, রুটিন ও পরীক্ষার সার্কুলার প্রকাশ করুন
        </p>
      </div>

      {/* Create Notice Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-2">
          নতুন নোটিশ তৈরি করুন
        </h2>
        <form action={createNotice} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">নোটিশের শিরোনাম (বাংলা) *</label>
              <input
                type="text"
                name="titleBn"
                required
                placeholder="যেমন: অর্ধবার্ষিক পরীক্ষার সময়সূচি প্রকাশ"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Title (English - Optional)</label>
              <input
                type="text"
                name="titleEn"
                placeholder="e.g. Half-Yearly Exam Schedule"
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">নোটিশের বিস্তারিত বিবরণ</label>
            <textarea
              name="contentBn"
              rows={3}
              placeholder="বিস্তারিত বিবরণ এখানে লিখুন..."
              className="form-input"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isImportant"
              name="isImportant"
              className="rounded text-[#1e3a5f]"
            />
            <label htmlFor="isImportant" className="text-xs font-semibold text-gray-700">
              জরুরি নোটিশ হিসেবে চিহ্নিত করুন (ওয়েবসাইটের শীর্ষে হাইলাইট হবে)
            </label>
          </div>

          <button type="submit" className="btn-primary !text-xs !py-2">
            <Plus size={16} /> নোটিশ প্রকাশ করুন
          </button>
        </form>
      </div>

      {/* Notices List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-2">
          প্রকাশিত নোটিশ তালিকা ({notices.length})
        </h2>

        {notices.length > 0 ? (
          <div className="space-y-3">
            {notices.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-xl border border-gray-200 flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={13} />
                    <span>{new Date(n.createdAt).toLocaleDateString("bn-BD")}</span>
                    {n.isImportant && (
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded">
                        জরুরি
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mt-1">
                    {n.translations[0]?.title || "শিরোনামবিহীন"}
                  </h3>
                </div>

                <form action={deleteNotice}>
                  <input type="hidden" name="id" value={n.id} />
                  <button
                    type="submit"
                    className="text-red-600 hover:text-red-800 text-xs font-semibold"
                  >
                    মুছে ফেলুন
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-4">কোনো নোটিশ নেই।</p>
        )}
      </div>
    </div>
  );
}
