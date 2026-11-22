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
  GraduationCap,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface NavGroup {
  groupName: string;
  items: {
    name: string;
    href: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    badge?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    groupName: "প্রধান ড্যাশবোর্ড",
    items: [
      { name: "ড্যাশবোর্ড ওভারভিউ", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    groupName: "একাডেমিক ও শিক্ষার্থী",
    items: [
      { name: "প্রতিষ্ঠান ও শ্রেণি রুটিন", href: "/admin/academics", icon: GraduationCap, badge: "আপডেট" },
      { name: "ভর্তি আবেদনসমূহ", href: "/admin/admissions", icon: BookOpen },
      { name: "শিক্ষক ব্যবস্থাপনা", href: "/admin/teachers", icon: Users },
      { name: "প্রশাসন ও কমিটি", href: "/admin/administration", icon: Users },
    ],
  },
  {
    groupName: "কনটেন্ট ও প্রকাশনা",
    items: [
      { name: "হোমপেজ স্লাইডার", href: "/admin/homepage-slider", icon: Sliders },
      { name: "জরুরি ঘোষণা পপ-আপ", href: "/admin/announcement-popup", icon: Megaphone },
      { name: "নোটিশ প্রকাশনা", href: "/admin/notices", icon: Bell },
      { name: "সংবাদ ও ব্লগ", href: "/admin/news", icon: Newspaper },
      { name: "ইভেন্ট ও ক্যালেন্ডার", href: "/admin/events", icon: Calendar },
    ],
  },
  {
    groupName: "মিডিয়া ও ফাইল",
    items: [
      { name: "ফটো গ্যালারি", href: "/admin/gallery", icon: GalleryIcon },
      { name: "মিডিয়া লাইব্রেরি", href: "/admin/media", icon: FolderOpen },
    ],
  },
  {
    groupName: "সিস্টেম ও সাপোর্ট",
    items: [
      { name: "যোগাযোগ বার্তা (Inbox)", href: "/admin/contact", icon: Mail },
      { name: "ভেরিফিকেশন কেন্দ্র", href: "/admin/verification", icon: ShieldAlert },
      { name: "ওয়েবসাইট সেটিংস", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#14263f] text-white flex flex-col shrink-0 h-screen border-r border-white/10 select-none shadow-2xl z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/10 bg-[#0f1d30]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a84c] to-amber-500 text-[#1e3a5f] font-black flex items-center justify-center text-base shadow-md shrink-0">
            পব
          </div>
          <div className="min-w-0">
            <h2 className="font-extrabold text-sm tracking-tight text-white truncate">
              পল্লবী বিদ্যানিকেতন
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[10px] text-amber-300 font-medium tracking-wide">
                CMS • EIIN: ১০৮৩২৫
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Groups - Independently scrollable if needed */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
        {navGroups.map((group) => (
          <div key={group.groupName} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>{group.groupName}</span>
            </div>
            {group.items.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href + item.name}
                  href={item.href}
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-r from-[#c9a84c] to-amber-400 text-[#14263f] font-bold shadow-md shadow-amber-950/20"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      size={16}
                      className={isActive ? "text-[#14263f]" : "text-gray-400 group-hover:text-amber-300 transition-colors"}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {item.badge && !isActive && (
                    <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-md font-bold shrink-0">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight size={13} className="text-[#14263f] shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-white/10 bg-[#0f1d30]/60 text-center">
        <p className="text-[10px] text-gray-400">
          পল্লবী বিদ্যানিকেতন © ২০২৬
        </p>
      </div>
    </aside>
  );
}
