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
  facebookUrl,
  youtubeUrl,
}: PublicFooterProps) {
  const displayName = schoolName || t(locale, "school.name");

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
    <footer className="bg-[#1e3a5f] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* School Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-amber-300">
              {displayName}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {locale === "bn"
                ? "মিরপুর-৭, পল্লবী, ঢাকায় অবস্থিত একটি স্বনামধন্য মাধ্যমিক শিক্ষাপ্রতিষ্ঠান। EIIN: ১০৮৩২৫"
                : "A reputed secondary educational institution in Mirpur-7, Pallabi, Dhaka. EIIN: 108325"}
            </p>
            <div className="flex gap-3">
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center justify-center text-xs font-bold w-8 h-8"
                  aria-label="Facebook"
                >
                  fb
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base mb-4 text-amber-300">
              {locale === "bn" ? "দ্রুত লিঙ্ক" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-amber-300 text-sm transition-colors"
                  >
                    → {t(locale, link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-base mb-4 text-amber-300">
              {t(locale, "section.contact")}
            </h3>
            <div className="space-y-3">
              {(address || t(locale, "school.address")) && (
                <div className="flex gap-2 text-gray-300 text-sm">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-amber-300" />
                  <span>{address || t(locale, "school.address")}</span>
                </div>
              )}
              {phone && (
                <div className="flex gap-2 text-gray-300 text-sm">
                  <Phone size={16} className="shrink-0 text-amber-300" />
                  <a href={`tel:${phone}`} className="hover:text-white">
                    {phone}
                  </a>
                </div>
              )}
              {email && (
                <div className="flex gap-2 text-gray-300 text-sm">
                  <Mail size={16} className="shrink-0 text-amber-300" />
                  <a href={`mailto:${email}`} className="hover:text-white break-all">
                    {email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div>
            <h3 className="font-bold text-base mb-4 text-amber-300">
              {locale === "bn" ? "আমাদের অবস্থান" : "Our Location"}
            </h3>
            <div className="rounded-lg overflow-hidden h-32 bg-blue-900 flex items-center justify-center">
              <a
                href="https://maps.google.com/?q=Pallabi+Bidyaniketan+Mirpur-7+Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-300 hover:text-white text-center px-4"
              >
                {locale === "bn"
                  ? "গুগল ম্যাপে দেখুন"
                  : "View on Google Maps"}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-blue-900">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <span>
            © {new Date().getFullYear()} {displayName}.{" "}
            {locale === "bn"
              ? "সর্বস্বত্ব সংরক্ষিত।"
              : "All rights reserved."}
          </span>
          <Link href="/admin" className="hover:text-gray-200 transition-colors">
            {locale === "bn" ? "প্রশাসনিক প্যানেল" : "Admin Panel"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
