import { prisma } from "@/lib/prisma";
import MediaManager from "./MediaManager";
import { formatFileSize } from "@/lib/utils";

export default async function AdminMediaPage() {
  const [mediaList, totalCount, totalSizeResult] = await Promise.all([
    prisma.media.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.media.count(),
    prisma.media.aggregate({ _sum: { size: true } }),
  ]);

  const totalBytes = totalSizeResult._sum.size || 0;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
            মিডিয়া লাইব্রেরি (Media Library)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            মোট ছবি: {totalCount} টি | সংরক্ষিত আকার: {formatFileSize(totalBytes)}
          </p>
        </div>
      </div>

      <MediaManager initialMedia={mediaList} />
    </div>
  );
}
