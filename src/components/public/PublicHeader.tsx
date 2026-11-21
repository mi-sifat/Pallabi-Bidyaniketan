"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface NavItem {
  key: string;
  href: string;
  children?: { key: string; href: string }[];
}

const navItems: NavItem[] = [
  { key: "nav.home", href: "/" },
  {
    key: "nav.about",
    href: "/about",
    children: [
      { key: "nav.about", href: "/about" },
      { key: "nav.administration", href: "/administration" },
    ],
  },
  { key: "nav.teachers", href: "/teachers" },
  { key: "nav.academics", href: "/academics" },
  { key: "nav.admission", href: "/admission" },
  { key: "nav.results", href: "/results" },
  { key: "nav.notices", href: "/notices" },
  {
    key: "nav.news",
    href: "/news",
    children: [
      { key: "nav.news", href: "/news" },
      { key: "nav.events", href: "/events" },
    ],
  },
  { key: "nav.gallery", href: "/gallery" },
  { key: "nav.downloads", href: "/downloads" },
  { key: "nav.contact", href: "/contact" },
];

interface PublicHeaderProps {
  locale: Locale;
  schoolName?: string;
  logoUrl?: string | null;
}

export default function PublicHeader({
  locale,
  schoolName,
  logoUrl,
}: PublicHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const otherLocale: Locale = locale === "bn" ? "en" : "bn";
  const displayName = schoolName || t(locale, "school.name");

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#1e3a5f] text-white text-xs py-1.5 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span>{t(locale, "school.eiin")} | {t(locale, "school.board")}</span>
          <div className="flex items-center gap-4">
            <span>📞 +8801309108325</span>
            <Link href={`/${otherLocale}`} className="flex items-center gap-1 hover:text-amber-300 transition-colors">
              <Globe size={12} />
              {otherLocale === "bn" ? "বাংলা" : "English"}
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          "bg-white sticky top-0 z-50 transition-all duration-300",
          scrolled ? "shadow-md" : "shadow-sm"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo + Name */}
            <Link href={`/${locale}`} className="flex items-center gap-3">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={displayName}
                  width={56}
                  height={56}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white font-bold text-xl">
                  পব
                </div>
              )}
              <div>
                <div className="font-bold text-[#1e3a5f] text-base md:text-lg leading-tight">
                  {displayName}
                </div>
                <div className="text-xs text-gray-500 hidden sm:block">
                  {t(locale, "school.address")}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div key={item.key} className="relative group">
                  {item.children ? (
                    <button
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#1e3a5f] hover:bg-gray-50 rounded-lg transition-all"
                      onMouseEnter={() => setOpenDropdown(item.key)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {t(locale, item.key)}
                      <ChevronDown size={14} />
                    </button>
                  ) : (
                    <Link
                      href={`/${locale}${item.href}`}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#1e3a5f] hover:bg-gray-50 rounded-lg transition-all block"
                    >
                      {t(locale, item.key)}
                    </Link>
                  )}
                  {item.children && openDropdown === item.key && (
                    <div
                      className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
                      onMouseEnter={() => setOpenDropdown(item.key)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.key}
                          href={`/${locale}${child.href}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1e3a5f]"
                        >
                          {t(locale, child.key)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-[#1e3a5f]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={`/${locale}${item.href}`}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1e3a5f] rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(locale, item.key)}
                </Link>
              ))}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <Link
                  href={`/${otherLocale}`}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Globe size={16} />
                  {otherLocale === "bn" ? "বাংলা" : "English"}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
