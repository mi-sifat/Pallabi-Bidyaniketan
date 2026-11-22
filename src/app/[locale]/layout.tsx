import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import AnnouncementPopup from "@/components/public/AnnouncementPopup";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

  let profile = null;
  let activePopup = null;

  try {
    if (prisma) {
      [profile, activePopup] = await Promise.all([
        prisma.schoolProfile.findFirst(),
        prisma.announcementPopup.findFirst({
          where: { isActive: true },
          orderBy: { updatedAt: "desc" },
        }),
      ]);
    }
  } catch {
    // DB not available (build-time or missing DATABASE_URL)
  }

  const schoolName =
    locale === "bn"
      ? profile?.nameBn || "পল্লবী বিদ্যানিকেতন"
      : profile?.nameEn || "Pallabi Bidyaniketan";

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd] text-[#1a1a2e]">
      <div className="print:hidden">
        <PublicHeader
          locale={locale as Locale}
          schoolName={schoolName}
          logoUrl={profile?.logoUrl || "/uploads/branding/logo.jpg"}
        />
      </div>
      <main className="flex-1">{children}</main>
      <div className="print:hidden">
        <PublicFooter
          locale={locale as Locale}
          schoolName={schoolName}
          phone={profile?.phone}
          email={profile?.email}
          address={locale === "bn" ? profile?.addressBn : profile?.addressEn}
          facebookUrl={profile?.facebookUrl}
          youtubeUrl={profile?.youtubeUrl}
        />
      </div>
      <AnnouncementPopup popup={activePopup} locale={locale as Locale} />
    </div>
  );
}
