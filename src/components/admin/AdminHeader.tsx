"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { ExternalLink, LogOut, User } from "lucide-react";

export default function AdminHeader({
  userName,
  userEmail,
  userRole,
}: {
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
}) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Link
          href="/bn"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs text-[#1e3a5f] hover:text-[#c9a84c] font-semibold border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
        >
          <ExternalLink size={14} />
          মূল ওয়েবসাইট দেখুন (Visit Site)
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 text-right">
          <div className="w-8 h-8 rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f] font-bold flex items-center justify-center text-xs">
            <User size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-800 leading-tight">
              {userName || userEmail || "অ্যাডমিনিস্ট্রেটর"}
            </div>
            <div className="text-[10px] text-gray-500 font-medium">
              {userRole || "SUPER_ADMIN"}
            </div>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex items-center gap-1 font-medium"
          title="লগআউট"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">লগআউট</span>
        </button>
      </div>
    </header>
  );
}
