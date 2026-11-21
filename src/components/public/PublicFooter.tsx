import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface PublicFooterProps {
  locale: Locale;
  schoolName?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
}

export default function PublicFooter({
  locale,
  schoolName,
  phone,
  email,
  address,
  facebookUrl = "https://www.facebook.com/Bangabandhu1977",
  youtubeUrl,
}: PublicFooterProps) {
  const displayName = schoolName || t(locale, "school.name");
  const actualFacebook = facebookUrl || "https://www.facebook.com/Bangabandhu1977";

  const quickLinks = [
    { key: "nav.about", href: `/${locale}/about` },
    { key: "nav.teachers", href: `/${locale}/teachers` },
    { key: "nav.academics", href: `/${locale}/academics` },
    { key: "nav.admission", href: `/${locale}/admission` },
    { key: "nav.results", href: `/${locale}/results` },
    { key: "nav.notices", href: `/${locale}/notices` },
    { key: "nav.gallery", href: `/${locale}/gallery` },
    { key: "nav.contact", href: `/${locale}/contact` },
  ];

  return (
    <footer className="bg-[#1e3a5f] text-white border-t-4 border-[#c9a84c]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 1. School Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1 border border-white/20 shadow-md shrink-0 relative overflow-hidden flex items-center justify-center">
                <img
                  src="/uploads/branding/logo.jpg"
                  alt={displayName}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white tracking-wide leading-snug">
                  {displayName}
                </h3>
                <span className="text-[11px] text-[#c9a84c] font-bold block">
                  EIIN: ১০৮৩২৫ | স্থাপিত: ১৯৭৭
                </span>
              </div>
            </div>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              {locale === "bn"
                ? "পল্লবী বিদ্যানিকেতন (বঙ্গবন্ধু বিদ্যানিকেতন), মিরপুর-৭, ঢাকা। গুণগত শিক্ষা, নৈতিক চরিত্র গঠন ও সুশৃঙ্খল পরিবেশের অঙ্গীকার।"
                : "Pallabi Bidyaniketan (Bangabandhu Bidyaniketan), Mirpur-7, Dhaka. Dedicated to excellence in education, ethics and discipline."}
            </p>

            {/* Social Media Links */}
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                সামাজিক যোগাযোগ
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href={actualFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white flex items-center justify-center shadow-md transition-all hover:scale-105"
                  aria-label="Facebook Page"
                  title="Official Facebook Page"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {youtubeUrl && (
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-[#FF0000] hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-all hover:scale-105"
                    aria-label="YouTube Channel"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="font-bold text-sm text-[#c9a84c] uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              {locale === "bn" ? "গুরুত্বপূর্ণ লিংক" : "Quick Links"}
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-xs">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-[#c9a84c] transition-colors inline-flex items-center gap-1 hover:translate-x-1 duration-150"
                  >
                    <span className="text-[#c9a84c]">&bull;</span>
                    <span>{t(locale, link.key)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact Info */}
          <div>
            <h3 className="font-bold text-sm text-[#c9a84c] uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              {t(locale, "section.contact")}
            </h3>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#c9a84c]" />
                <span className="leading-relaxed">
                  {address || "মিল্কভিটা রোড, মিরপুর-৭, পল্লবী, ঢাকা-১২১৬, বাংলাদেশ"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="shrink-0 text-[#c9a84c]" />
                <a href={`tel:${phone || "+8801309108325"}`} className="hover:text-white transition-colors">
                  {phone || "+8801309108325"}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="shrink-0 text-[#c9a84c]" />
                <a href={`mailto:${email || "info@pbn.edu.bd"}`} className="hover:text-white transition-colors">
                  {email || "info@pbn.edu.bd"}
                </a>
              </div>
            </div>
          </div>

          {/* 4. Real Interactive Google Map */}
          <div>
            <h3 className="font-bold text-sm text-[#c9a84c] uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              {locale === "bn" ? "গুগল ম্যাপে আমাদের অবস্থান" : "Interactive Location Map"}
            </h3>
            <div className="rounded-xl overflow-hidden h-36 bg-gray-800 border border-white/15 shadow-inner relative">
              <iframe
                src="https://maps.google.com/maps?q=Pallabi+Bidyaniketan,+Mirpur-7,+Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Pallabi Bidyaniketan Location Map"
                className="w-full h-full"
              />
            </div>
            <a
              href="https://maps.google.com/?q=Pallabi+Bidyaniketan+Mirpur-7+Dhaka"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-[11px] text-[#c9a84c] hover:underline inline-block font-semibold"
            >
              Google Maps এ পূর্ণ স্ক্রিনে খুলুন &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-[#162a45]">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center sm:text-left">
            <span>
              © {new Date().getFullYear()} {displayName}.{" "}
              {locale === "bn"
                ? "সর্বস্বত্ব সংরক্ষিত। EIIN: ১০৮৩২৫"
                : "All rights reserved. EIIN: 108325"}
            </span>
            <span className="hidden sm:inline text-gray-600">|</span>
            <span className="text-gray-300">
              Developed by{" "}
              <a
                href="https://majharul-islam-sifat.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold text-[#c9a84c] hover:text-amber-300 hover:underline transition-colors inline-flex items-center gap-1"
                title="Majharul Islam Sifat — Developer Portfolio"
              >
                <span>Majharul Islam Sifat</span>
                <span className="text-[11px]">↗</span>
              </a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/about`} className="hover:text-gray-200 transition-colors">
              {locale === "bn" ? "বিদ্যালয় সম্পর্কে" : "About"}
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-amber-300 font-semibold transition-colors">
              {locale === "bn" ? "প্রশাসনিক লগইন" : "Admin Login"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
