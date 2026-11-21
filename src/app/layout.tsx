import type { Metadata } from "next";
import { Noto_Sans_Bengali, Inter } from "next/font/google";
import "./globals.css";

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
      <body
        className={`${notoBengali.variable} ${inter.variable} font-bengali antialiased bg-gray-50 text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
