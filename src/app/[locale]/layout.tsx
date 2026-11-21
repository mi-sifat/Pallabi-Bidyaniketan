import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import AnnouncementPopup from "@/components/public/AnnouncementPopup";
import { prisma } from "@/lib/prisma";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const [profile, activePopup] = await Promise.all([
    prisma.schoolProfile.findFirst(),
    prisma.announcementPopup.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const schoolName =
    locale === "bn"
      ? profile?.nameBn || "পল্লবী বিদ্যানিকেতন"
      : profile?.nameEn || "Pallabi Bidyaniketan";

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd] text-[#1a1a2e]">
      <PublicHeader
        locale={locale as Locale}
        schoolName={schoolName}
        logoUrl={profile?.logoUrl || "/uploads/branding/logo.jpg"}
      />
      <main className="flex-1">{children}</main>
      <PublicFooter
        locale={locale as Locale}
        schoolName={schoolName}
        phone={profile?.phone}
        email={profile?.email}
        address={locale === "bn" ? profile?.addressBn : profile?.addressEn}
        facebookUrl={profile?.facebookUrl}
        youtubeUrl={profile?.youtubeUrl}
      />
      <AnnouncementPopup popup={activePopup} locale={locale as Locale} />
    </div>
  );
}
