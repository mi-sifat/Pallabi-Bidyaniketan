import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "পল্লবী বিদ্যানিকেতন | Pallabi Bidyaniketan",
    template: "%s | পল্লবী বিদ্যানিকেতন",
  },
  description:
    "পল্লবী বিদ্যানিকেতন - মিরপুর-৭, পল্লবী, ঢাকা। EIIN: 108325. ঢাকা মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড অনুমোদিত মাধ্যমিক বিদ্যালয়।",
  keywords: [
    "Pallabi Bidyaniketan",
    "পল্লবী বিদ্যানিকেতন",
    "Mirpur school",
    "EIIN 108325",
    "Dhaka school",
    "secondary school",
    "মাধ্যমিক বিদ্যালয়",
  ],
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: "en_US",
    siteName: "পল্লবী বিদ্যানিকেতন",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-bengali antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
