import { prisma } from "@/lib/prisma";
import EventManager from "./EventManager";

export default async function AdminEventsPage() {
  const events = await prisma.schoolEvent.findMany({
    include: {
      album: {
        include: { images: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
          ইভেন্ট ও অনুষ্ঠানসূচি ব্যবস্থাপনা (Events Management)
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          বিদ্যালয়ের বার্ষিক ক্রীড়া, সাংস্কৃতিক উৎসব, জাতীয় দিবস ও অন্যান্য অনুষ্ঠানের বিবরণ ও ছবি প্রকাশ করুন
        </p>
      </div>

      <EventManager initialEvents={events} />
    </div>
  );
}
