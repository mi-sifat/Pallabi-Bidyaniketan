import { prisma } from "@/lib/prisma";
import NewsManager from "./NewsManager";

export default async function AdminNewsPage() {
  const [newsList, albums, events] = await Promise.all([
    prisma.news.findMany({
      include: { translations: true, album: true, event: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.galleryAlbum.findMany({
      select: { id: true, titleBn: true, titleEn: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.schoolEvent.findMany({
      select: { id: true, titleBn: true, titleEn: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const albumOptions = albums.map((a) => ({
    id: a.id,
    title: a.titleBn || a.titleEn,
  }));

  const eventOptions = events.map((e) => ({
    id: e.id,
    title: e.titleBn || e.titleEn,
  }));

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
          সংবাদ ও ব্লগ আর্টিকেল ব্যবস্থাপনা (News & Blog)
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          বিদ্যালয়ের বিভিন্ন অনুষ্ঠান, জাতীয় দিবস উদযাপন, শিক্ষা সফর ও অর্জনের বিস্তারিত সংবাদ ও ছবি প্রকাশ করুন
        </p>
      </div>

      <NewsManager
        initialNews={newsList}
        albums={albumOptions}
        events={eventOptions}
      />
    </div>
  );
}
