"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sliders,
  Megaphone,
  Users,
  Calendar,
  Image as GalleryIcon,
  Newspaper,
  Bell,
  FolderOpen,
  BookOpen,
  Settings,
  ShieldAlert,
  Mail,
} from "lucide-react";

const navigation = [
  { name: "ড্যাশবোর্ড (Dashboard)", href: "/admin", icon: LayoutDashboard },
  { name: "হোমপেজ স্লাইডার (Slider)", href: "/admin/homepage-slider", icon: Sliders },
  { name: "ঘোষণা পপ-আপ (Popup)", href: "/admin/announcement-popup", icon: Megaphone },
  { name: "শিক্ষক ব্যবস্থাপনা (Teachers)", href: "/admin/teachers", icon: Users },
  { name: "ইভেন্ট ও অনুষ্ঠান (Events)", href: "/admin/events", icon: Calendar },
  { name: "ফটো গ্যালারি (Gallery)", href: "/admin/gallery", icon: GalleryIcon },
  { name: "ব্লগ ও সংবাদ (Blog Posts)", href: "/admin/news", icon: Newspaper },
  { name: "নোটিশ প্রকাশনা (Notices)", href: "/admin/notices", icon: Bell },
  { name: "মিডিয়া লাইব্রেরি (Media)", href: "/admin/media", icon: FolderOpen },
  { name: "প্রতিষ্ঠান ও ক্লাস (School Info)", href: "/admin/academics", icon: BookOpen },
  { name: "ওয়েবসাইট সেটিংস (Settings)", href: "/admin/settings", icon: Settings },
  { name: "অনুমোদন ও রিভিউ (Review)", href: "/admin/verification", icon: ShieldAlert },
  { name: "যোগাযোগ বার্তা (Inbox)", href: "/admin/contact", icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#1e3a5f] text-white flex flex-col shrink-0 min-h-screen">
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#c9a84c] text-[#1e3a5f] font-extrabold flex items-center justify-center text-lg">
          পব
        </div>
        <div>
          <div className="font-bold text-sm tracking-wide text-white">
            পল্লবী বিদ্যানিকেতন
          </div>
          <div className="text-[10px] text-amber-300 font-medium">
            অ্যাডমিন সিএমএস (EIIN 108325)
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${isActive
                ? "bg-[#c9a84c] text-[#1e3a5f] font-bold shadow-sm"
                : "text-gray-200 hover:bg-white/10 hover:text-white"
                }`}
            >
              <Icon size={16} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 text-[11px] text-gray-400">
        সহজ স্কুল কনটেন্ট ম্যানেজমেন্ট
      </div>
    </aside>
  );
}
