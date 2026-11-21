import { prisma } from "@/lib/prisma";
import { Newspaper, Plus } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminNewsPage() {
  const newsList = await prisma.news.findMany({
    include: { translations: true },
    orderBy: { createdAt: "desc" },
  });

  async function createNews(formData: FormData) {
    "use server";
    const titleBn = formData.get("titleBn") as string;
    const contentBn = formData.get("contentBn") as string;
    const coverImageUrl = formData.get("coverImageUrl") as string;

    if (!titleBn) return;
    const slug = `news-${Date.now()}`;

    await prisma.news.create({
      data: {
        slug,
        coverImageUrl: coverImageUrl || undefined,
        isPublished: true,
        status: "PUBLISHED",
        translations: {
          create: [{ locale: "bn", title: titleBn, content: contentBn }],
        },
      },
    });

    revalidatePath("/admin/news");
    revalidatePath("/bn/news");
    revalidatePath("/en/news");
  }

  async function deleteNews(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    await prisma.news.delete({ where: { id } });
    revalidatePath("/admin/news");
    revalidatePath("/bn/news");
    revalidatePath("/en/news");
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
          সংবাদ ও ইভেন্টস প্রকাশনা (News & Events)
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          বিদ্যালয়ের বিভিন্ন অনুষ্ঠান, জাতীয় দিবস উদযাপন ও শিক্ষা সফরের সংবাদ প্রকাশ করুন
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-2">
          নতুন সংবাদ তৈরি করুন
        </h2>
        <form action={createNews} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="form-label">সংবাদের শিরোনাম *</label>
            <input
              type="text"
              name="titleBn"
              required
              placeholder="যেমন: পল্লবী বিদ্যানিকেতনে বার্ষিক ক্রীড়া প্রতিযোগিতা অনুষ্ঠিত"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">কভার ছবির URL (ঐচ্ছিক)</label>
            <input
              type="text"
              name="coverImageUrl"
              placeholder="/uploads/event1.jpg অথবা অনলাইন ছবির লিংক"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">বিস্তারিত বিবরণ</label>
            <textarea
              name="contentBn"
              rows={4}
              placeholder="সংবাদের পূর্ণ বিবরণ এখানে লিখুন..."
              className="form-input"
            />
          </div>

          <button type="submit" className="btn-primary !text-xs !py-2">
            <Plus size={16} /> সংবাদ প্রকাশ করুন
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-2">
          প্রকাশিত সংবাদ তালিকা ({newsList.length})
        </h2>
        {newsList.length > 0 ? (
          <div className="space-y-3">
            {newsList.map((n) => (
              <div key={n.id} className="p-4 border rounded-xl flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{n.translations[0]?.title}</h4>
                  <span className="text-gray-400">{new Date(n.createdAt).toLocaleDateString("bn-BD")}</span>
                </div>
                <form action={deleteNews}>
                  <input type="hidden" name="id" value={n.id} />
                  <button type="submit" className="text-red-600 hover:underline font-semibold">
                    মুছুন
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-4">কোনো সংবাদ প্রকাশিত নেই।</p>
        )}
      </div>
    </div>
  );
}
