import { prisma } from "@/lib/prisma";
import {
  Share2 as FacebookIcon,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Image as ImageIcon,
  BookOpen,
} from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import FacebookImportForm from "./FacebookImportForm";

export default async function FacebookImportPage() {
  const [profile, imports, mediaCount] = await Promise.all([
    prisma.schoolProfile.findFirst(),
    prisma.facebookImport.findMany({
      orderBy: { importedAt: "desc" },
      include: {
        album: true,
        news: { include: { translations: true } },
        event: true,
      },
    }),
    prisma.media.count({ where: { category: "facebook_import" } }),
  ]);

  const fbUrl = profile?.facebookUrl || "https://www.facebook.com/Bangabandhu1977";

  // Server actions for approving / publishing Facebook imports
  async function approveImport(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;

    await prisma.facebookImport.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        verificationStatus: "VERIFIED",
      },
    });

    revalidatePath("/admin/facebook-import");
    revalidatePath("/bn/gallery");
    revalidatePath("/en/gallery");
    revalidatePath("/bn/news");
    revalidatePath("/en/news");
  }

  async function deleteImport(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;

    await prisma.facebookImport.delete({
      where: { id },
    });

    revalidatePath("/admin/facebook-import");
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1877F2] to-[#0D47A1] text-white p-6 rounded-2xl shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
              <FacebookIcon size={14} />
              অফিসিয়াল ফেসবুক পেজ ইন্টিগ্রেশন
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Facebook Content Import & Historical Photo Migration
            </h1>
            <p className="text-xs text-blue-100">
              বিদ্যালয়ের ঐতিহাসিক ইভেন্ট, ক্রীড়া ও সাংস্কৃতিক কর্মকাণ্ডের ছবি আমদানি এবং আর্কাইভ
            </p>
          </div>

          <a
            href={fbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#1877F2] hover:bg-blue-50 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-all shrink-0 self-start sm:self-center"
          >
            পেজ ওপেন করুন <ExternalLink size={13} />
          </a>
        </div>

        <div className="pt-2 flex flex-wrap gap-4 text-xs text-blue-200 border-t border-white/20">
          <span>
            🌐 <strong>লক্ষ্য ফেসবুক পেজ:</strong> {fbUrl}
          </span>
          <span>
            🔒 <strong>এপিআই অবস্থা:</strong> Meta Graph API (ম্যানুয়াল ও অনুমোদিত পোস্ট ইমপোর্টার সক্রিয়)
          </span>
        </div>
      </div>

      {/* Import Statistics & Report Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center space-y-1">
          <div className="text-2xl font-extrabold text-[#1e3a5f]">{imports.length}</div>
          <div className="text-xs text-gray-500 font-medium">মোট ফেসবুক পোস্ট ইমপোর্ট</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center space-y-1">
          <div className="text-2xl font-extrabold text-green-700">
            {imports.filter((i) => i.status === "PUBLISHED").length}
          </div>
          <div className="text-xs text-gray-500 font-medium">অনুমোদিত ও প্রকাশিত</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center space-y-1">
          <div className="text-2xl font-extrabold text-amber-600">
            {imports.filter((i) => i.status === "PENDING_APPROVAL").length}
          </div>
          <div className="text-xs text-gray-500 font-medium">অনুমোদন অপেক্ষমান</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center space-y-1">
          <div className="text-2xl font-extrabold text-purple-700">{mediaCount}</div>
          <div className="text-xs text-gray-500 font-medium">মিডিয়া লাইব্রেরিতে সংরক্ষিত ছবি</div>
        </div>
      </div>

      {/* Interactive Import Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-3 flex items-center gap-2">
          <Upload size={18} className="text-[#c9a84c]" />
          নতুন ফেসবুক পোস্ট ও ছবি আমদানি করুন (Import Post & Photos)
        </h2>

        <FacebookImportForm defaultPageUrl={fbUrl} />
      </div>

      {/* Imported Posts List & Approval Workflow */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1e3a5f] border-b border-gray-100 pb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Layers size={18} className="text-[#c9a84c]" />
            আমদানিকৃত ফেসবুক পোস্ট তালিকা ও অনুমোদন ({imports.length})
          </span>
          <span className="text-xs text-gray-400 font-normal">
            ৩-মুখী লিঙ্ক: অ্যালবাম • ইভেন্ট • আর্টিকেল
          </span>
        </h2>

        {imports.length > 0 ? (
          <div className="space-y-4">
            {imports.map((item) => {
              const mediaList = item.mediaUrls ? JSON.parse(item.mediaUrls) : [];
              return (
                <div
                  key={item.id}
                  className="p-5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-gray-900 text-sm">
                        {item.eventTitle || "Facebook Post"}
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded ml-2">
                        {item.eventCategory}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.status === "PUBLISHED" ? (
                        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 size={12} /> প্রকাশিত
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Clock size={12} /> অনুমোদন অপেক্ষমান
                        </span>
                      )}
                    </div>
                  </div>

                  {item.caption && (
                    <p className="text-gray-700 leading-relaxed bg-white p-3 rounded-lg border border-gray-100">
                      {item.caption}
                    </p>
                  )}

                  {/* 3-Way Linked Records Badges */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] pt-1">
                    {item.album && (
                      <Link
                        href={`/bn/gallery/${item.album.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[#1e3a5f] bg-white border border-gray-200 px-2.5 py-1 rounded-md hover:bg-gray-100"
                      >
                        <ImageIcon size={13} className="text-[#c9a84c]" />
                        গ্যালারি অ্যালবাম: {item.album.titleBn || item.album.titleEn}
                      </Link>
                    )}
                    {item.news && (
                      <Link
                        href={`/bn/news/${item.news.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[#1e3a5f] bg-white border border-gray-200 px-2.5 py-1 rounded-md hover:bg-gray-100"
                      >
                        <BookOpen size={13} className="text-blue-600" />
                        নিউজ আর্টিকেল: {item.news.translations[0]?.title}
                      </Link>
                    )}
                    {item.event && (
                      <span className="inline-flex items-center gap-1 text-gray-700 bg-white border border-gray-200 px-2.5 py-1 rounded-md">
                        <Calendar size={13} className="text-purple-600" />
                        ইভেন্ট তৈরি হয়েছে
                      </span>
                    )}
                    {item.fbPostUrl && (
                      <a
                        href={item.fbPostUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline ml-auto"
                      >
                        মূল ফেসবুক পোস্ট <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  {/* Attached Photos Preview */}
                  {mediaList.length > 0 && (
                    <div className="pt-2">
                      <span className="font-semibold text-gray-500 block mb-1.5">
                        সংরক্ষিত ছবি ({mediaList.length} টি):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {mediaList.map((url: string, idx: number) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 block relative hover:opacity-80 transition-opacity"
                          >
                            <img
                              src={url}
                              alt="Imported preview"
                              className="w-full h-full object-cover"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
                    {item.status !== "PUBLISHED" && (
                      <form action={approveImport}>
                        <input type="hidden" name="id" value={item.id} />
                        <button
                          type="submit"
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                        >
                          অনুমোদন ও প্রকাশ
                        </button>
                      </form>
                    )}
                    <form action={deleteImport}>
                      <input type="hidden" name="id" value={item.id} />
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-800 px-2 py-1 text-xs font-semibold"
                      >
                        মুছে ফেলুন
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 text-xs">
            এখনও কোনো ফেসবুক পোস্ট আমদানি করা হয়নি। উপরের ফর্মটি ব্যবহার করে পোস্ট ও ছবি আমদানি করুন।
          </div>
        )}
      </div>
    </div>
  );
}
