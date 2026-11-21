import { prisma } from "@/lib/prisma";
import { Calendar, Plus, ExternalLink, ImageIcon, BookOpen } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { generateSlug } from "@/lib/utils";

export default async function AdminEventsPage() {
  const events = await prisma.schoolEvent.findMany({
    include: { album: true, news: true },
    orderBy: { createdAt: "desc" },
  });

  async function createEvent(formData: FormData) {
    "use server";
    const titleBn = formData.get("titleBn") as string;
    const category = formData.get("category") as string;
    const eventDate = formData.get("eventDate") as string;
    const location = formData.get("location") as string;
    const descriptionBn = formData.get("descriptionBn") as string;
    const coverImageUrl = formData.get("coverImageUrl") as string;

    if (!titleBn) return;
    const slug = `${generateSlug(titleBn)}-${Date.now()}`;

    await prisma.schoolEvent.create({
      data: {
        slug,
        titleBn,
        titleEn: titleBn,
        category: category || "Cultural",
        eventDate: eventDate ? new Date(eventDate) : new Date(),
        location: location || "বিদ্যালয় প্রাঙ্গণ, মিরপুর-৭",
        descriptionBn,
        descriptionEn: descriptionBn,
        coverImageUrl: coverImageUrl || undefined,
        isPublished: true,
        status: "PUBLISHED",
      },
    });

    revalidatePath("/admin/events");
    revalidatePath("/bn/events");
    revalidatePath("/en/events");
  }

  async function deleteEvent(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    await prisma.schoolEvent.delete({ where: { id } });
    revalidatePath("/admin/events");
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
          ইভেন্ট ও অনুষ্ঠান ক্যালেন্ডার ব্যবস্থাপনা (Events Management)
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          বিদ্যালয়ের বার্ষিক ক্রীড়া, সাংস্কৃতিক উৎসব ও জাতীয় দিবস অনুষ্ঠানের আয়োজন পরিচালনা
        </p>
      </div>

      {/* Create Event Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-2">
          নতুন ইভেন্ট যোগ করুন
        </h2>

        <form action={createEvent} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label font-semibold">অনুষ্ঠানের নাম *</label>
              <input
                type="text"
                name="titleBn"
                required
                placeholder="যেমন: মহান বিজয় দিবস উদযাপন"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label font-semibold">ক্যাটাগরি</label>
              <select name="category" className="form-input">
                <option value="ক্রীড়া ও অ্যাথলেটিকস">ক্রীড়া ও অ্যাথলেটিকস (Sports)</option>
                <option value="সাংস্কৃতিক অনুষ্ঠান">সাংস্কৃতিক অনুষ্ঠান (Cultural)</option>
                <option value="জাতীয় দিবস">জাতীয় দিবস (National Celebration)</option>
                <option value="শিক্ষা সফর">শিক্ষা সফর (Study Tour)</option>
                <option value="বিজ্ঞান মেলা">বিজ্ঞান মেলা (Science Fair)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label font-semibold">অনুষ্ঠানের তারিখ</label>
              <input type="date" name="eventDate" className="form-input" />
            </div>
            <div>
              <label className="form-label font-semibold">স্থান (Location)</label>
              <input
                type="text"
                name="location"
                placeholder="যেমন: বিদ্যালয় প্রাঙ্গণ, মিল্কভিটা রোড, মিরপুর-৭"
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label font-semibold">কভার ছবির লিংক</label>
            <input
              type="text"
              name="coverImageUrl"
              placeholder="/uploads/event-cover.jpg"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label font-semibold">অনুষ্ঠানের বিবরণ</label>
            <textarea
              name="descriptionBn"
              rows={3}
              placeholder="অনুষ্ঠানের সার্বিক বিবরণ..."
              className="form-input"
            />
          </div>

          <button type="submit" className="btn-primary !text-xs !py-2.5">
            <Plus size={16} /> ইভেন্ট সংরক্ষণ করুন
          </button>
        </form>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-2">
          নির্ধারিত ইভেন্ট তালিকা ({events.length})
        </h2>

        {events.length > 0 ? (
          <div className="space-y-3">
            {events.map((ev) => (
              <div key={ev.id} className="p-4 border rounded-xl flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={13} />
                    <span>{ev.eventDate ? new Date(ev.eventDate).toLocaleDateString("bn-BD") : "নির্ধারিত নয়"}</span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      {ev.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mt-1">{ev.titleBn}</h4>
                  {ev.location && <p className="text-gray-500 text-[11px]">স্থান: {ev.location}</p>}
                </div>

                <form action={deleteEvent}>
                  <input type="hidden" name="id" value={ev.id} />
                  <button type="submit" className="text-red-600 hover:underline font-semibold">
                    মুছুন
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-4">কোনো ইভেন্ট যুক্ত নেই।</p>
        )}
      </div>
    </div>
  );
}
