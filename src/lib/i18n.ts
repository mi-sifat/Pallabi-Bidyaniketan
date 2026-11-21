// Internationalization / i18n configuration

export const locales = ["bn", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "bn";

export const localeNames: Record<Locale, string> = {
  bn: "বাংলা",
  en: "English",
};

// Translations for static UI strings
export const translations: Record<Locale, Record<string, string>> = {
  bn: {
    // Navigation
    "nav.home": "হোম",
    "nav.about": "আমাদের সম্পর্কে",
    "nav.administration": "প্রশাসন",
    "nav.teachers": "শিক্ষকমণ্ডলী",
    "nav.academics": "একাডেমিক",
    "nav.admission": "ভর্তি",
    "nav.results": "ফলাফল",
    "nav.notices": "নোটিশ",
    "nav.news": "সংবাদ ও অনুষ্ঠান",
    "nav.events": "ইভেন্ট সূচি",
    "nav.gallery": "গ্যালারি",
    "nav.library": "গ্রন্থাগার",
    "nav.alumni": "প্রাক্তন শিক্ষার্থী",
    "nav.achievements": "অর্জন",
    "nav.downloads": "ডাউনলোড",
    "nav.contact": "যোগাযোগ",
    // School info
    "school.name": "পল্লবী বিদ্যানিকেতন",
    "school.tagline": "জ্ঞান, সততা ও মানবতার পথে",
    "school.eiin": "EIIN: ১০৮৩২৫",
    "school.board": "ঢাকা মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড",
    "school.address": "মিল্কভিটা রোড, মিরপুর-৭, পল্লবী, ঢাকা-১২১৬",
    // Sections
    "section.latestNotices": "সর্বশেষ নোটিশ",
    "section.newsEvents": "সংবাদ ও অনুষ্ঠান",
    "section.principalMessage": "প্রধান শিক্ষকের বার্তা",
    "section.ourTeachers": "আমাদের শিক্ষকমণ্ডলী",
    "section.gallery": "ফটো গ্যালারি",
    "section.achievements": "আমাদের অর্জন",
    "section.contact": "যোগাযোগ করুন",
    // Common
    "common.readMore": "আরও পড়ুন",
    "common.viewAll": "সব দেখুন",
    "common.download": "ডাউনলোড করুন",
    "common.search": "খুঁজুন",
    "common.loading": "লোড হচ্ছে...",
    "common.noResults": "কোনো ফলাফল পাওয়া যায়নি",
    "common.pendingVerification": "যাচাই করা হয়নি",
    // Admin
    "admin.dashboard": "ড্যাশবোর্ড",
    "admin.login": "প্রবেশ করুন",
    "admin.logout": "প্রস্থান করুন",
    // Contact form
    "contact.name": "আপনার নাম",
    "contact.email": "ইমেইল",
    "contact.phone": "ফোন নম্বর",
    "contact.subject": "বিষয়",
    "contact.message": "বার্তা",
    "contact.send": "পাঠান",
    "contact.success": "আপনার বার্তা সফলভাবে পাঠানো হয়েছে।",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.administration": "Administration",
    "nav.teachers": "Teachers",
    "nav.academics": "Academics",
    "nav.admission": "Admission",
    "nav.results": "Results",
    "nav.notices": "Notices",
    "nav.news": "News & Events",
    "nav.events": "Events Calendar",
    "nav.gallery": "Gallery",
    "nav.library": "Library",
    "nav.alumni": "Alumni",
    "nav.achievements": "Achievements",
    "nav.downloads": "Downloads",
    "nav.contact": "Contact",
    // School info
    "school.name": "Pallabi Bidyaniketan",
    "school.tagline": "On the Path of Knowledge, Integrity & Humanity",
    "school.eiin": "EIIN: 108325",
    "school.board": "Board of Intermediate and Secondary Education, Dhaka",
    "school.address": "Milk Vita Road, Mirpur-7, Pallabi, Dhaka-1216",
    // Sections
    "section.latestNotices": "Latest Notices",
    "section.newsEvents": "News & Events",
    "section.principalMessage": "Principal's Message",
    "section.ourTeachers": "Our Teachers",
    "section.gallery": "Photo Gallery",
    "section.achievements": "Our Achievements",
    "section.contact": "Contact Us",
    // Common
    "common.readMore": "Read More",
    "common.viewAll": "View All",
    "common.download": "Download",
    "common.search": "Search",
    "common.loading": "Loading...",
    "common.noResults": "No results found",
    "common.pendingVerification": "Pending Verification",
    // Admin
    "admin.dashboard": "Dashboard",
    "admin.login": "Sign In",
    "admin.logout": "Sign Out",
    // Contact form
    "contact.name": "Your Name",
    "contact.email": "Email",
    "contact.phone": "Phone Number",
    "contact.subject": "Subject",
    "contact.message": "Message",
    "contact.send": "Send Message",
    "contact.success": "Your message has been sent successfully.",
  },
};

export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] || translations.en[key] || key;
}
