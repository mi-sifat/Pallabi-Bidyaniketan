import { prisma } from "@/lib/prisma";
import PopupManager from "./PopupManager";

export default async function AdminAnnouncementPopupPage() {
  const popups = await prisma.announcementPopup.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
          জরুরি ঘোষণা ও ভর্তি পপ-আপ ব্যবস্থাপনা (Announcement Popup)
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          বিদ্যালয়ে নতুন ভর্তি কার্যক্রম বা জরুরি নোটিশের জন্য হোমপেজ পপ-আপ সক্রিয় ও পরিচালনা করুন
        </p>
      </div>

      <PopupManager initialPopups={popups} />
    </div>
  );
}
