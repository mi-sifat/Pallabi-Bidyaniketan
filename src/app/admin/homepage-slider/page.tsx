import { prisma } from "@/lib/prisma";
import SliderManager from "./SliderManager";

export default async function AdminHomepageSliderPage() {
  const slides = await prisma.homepageSlide.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
          হোমপেজ স্লাইডার ব্যবস্থাপনা (Homepage Slider)
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          ওয়েবসাইটের মূল হোমপেজে প্রদর্শিত স্লাইডার ব্যানার, শিরোনাম, বার্তা ও বাটন পরিচালনা করুন
        </p>
      </div>

      <SliderManager initialSlides={slides} />
    </div>
  );
}
