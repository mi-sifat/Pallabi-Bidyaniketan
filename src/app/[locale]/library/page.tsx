export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { BookOpen, Search, BookmarkCheck } from "lucide-react";

export default async function LibraryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const books = await prisma.libraryBook.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f]">
          {locale === "bn" ? "বিদ্যালয় লাইব্রেরি ও বই ক্যাটালগ" : "School Library & Book Catalogue"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {locale === "bn"
            ? "শিক্ষার্থীদের পাঠাভ্যাস ও জ্ঞানার্জনের জন্য উন্মুক্ত লাইব্রেরি রিসোর্স পরিচিতি"
            : "Public catalogue of reference books, educational journals, and literature"}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-[#1e3a5f] flex items-center gap-2">
          <BookmarkCheck className="text-[#c9a84c]" size={20} />
          {locale === "bn" ? "লাইব্রেরি পরিচিতি ও সেবা" : "Library Services Overview"}
        </h2>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          {locale === "bn"
            ? "পল্লবী বিদ্যানিকেতন লাইব্রেরিতে রয়েছে বিভিন্ন ক্লাসের পাঠ্যবই, রেফারেন্স গ্রন্থ, বিজ্ঞান সাময়িকী, মুক্তিযুদ্ধ ও ইতিহাস বিষয়ক সমৃদ্ধ গ্রন্থ সম্ভার। শিক্ষার্থীরা টিফিন ও নির্ধারিত ক্লাসে বই পড়ার সুযোগ পায়।"
            : "Our school library houses a collection of textbooks, reference works, historical archives, and national literature, inspiring young students to read extensively."}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 text-base">
          {locale === "bn" ? "বইয়ের ক্যাটালগ" : "Book Catalogue Listing"}
        </h3>
        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {books.map((b) => (
              <div key={b.id} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm space-y-1">
                <h4 className="font-bold text-gray-900 text-sm">{b.titleBn || b.titleEn}</h4>
                <p className="text-xs text-gray-500">লেখক: {b.author || "অজানা"}</p>
                <span className="text-[10px] bg-blue-50 text-[#1e3a5f] px-2 py-0.5 rounded font-medium inline-block mt-1">
                  {b.category || "General"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500 text-xs">
            লাইব্রেরির নতুন ক্যাটালগ তথ্য প্রশাসনিকভাবে যুক্ত করা হচ্ছে।
          </div>
        )}
      </div>
    </div>
  );
}
