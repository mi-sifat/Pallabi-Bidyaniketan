import { prisma } from "@/lib/prisma";
import { Image as ImageIcon, Upload, Trash2, Copy, ExternalLink, Filter } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;

  const where: Record<string, unknown> = {
    ...(category && category !== "all" ? { category } : {}),
    ...(q
      ? {
          OR: [
            { originalName: { contains: q } },
            { caption: { contains: q } },
          ],
        }
      : {}),
  };

  const [mediaList, totalCount, totalSizeResult] = await Promise.all([
    prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.media.count(),
    prisma.media.aggregate({ _sum: { size: true } }),
  ]);

  const totalBytes = totalSizeResult._sum.size || 0;

  async function deleteMedia(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    await prisma.media.delete({ where: { id } });
    revalidatePath("/admin/media");
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
            মিডিয়া লাইব্রেরি ও ফাইল স্টোরেজ (Media Library)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            মোট ফাইল: {totalCount} টি | সংরক্ষিত স্থান: {formatFileSize(totalBytes)}
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {["all", "facebook_import", "general", "branding", "events"].map((cat) => (
            <a
              key={cat}
              href={`/admin/media?category=${cat}`}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                (category || "all") === cat
                  ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat === "all" ? "সকল মিডিয়া" : cat === "facebook_import" ? "ফেসবুক ইমপোর্ট" : cat}
            </a>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {mediaList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              <div className="relative h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={item.url}
                  alt={item.altText || item.originalName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                  {formatFileSize(item.size)}
                </span>
              </div>

              <div className="p-3 space-y-1.5 text-xs">
                <p className="font-semibold text-gray-900 truncate" title={item.originalName}>
                  {item.caption || item.originalName}
                </p>
                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <span className="capitalize">{item.category}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1e3a5f] hover:underline font-semibold text-[11px]"
                  >
                    ভিউ ফাইল
                  </a>

                  <form action={deleteMedia} className="inline">
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      className="text-red-500 hover:text-red-700 p-1"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 size={13} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 space-y-2">
          <ImageIcon size={36} className="mx-auto text-gray-400" />
          <h3 className="font-bold text-gray-700">কোনো ফাইল পাওয়া যায়নি</h3>
          <p className="text-xs">
            ফেসবুক ইমপোর্টার অথবা অন্যান্য মডিউল থেকে ছবি আপলোড করলে সেগুলো এখানে প্রদর্শিত হবে।
          </p>
        </div>
      )}
    </div>
  );
}
