import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pallabibidyaniketan.edu.bd";
  const locales = ["bn", "en"];
  const routes = [
    "",
    "/about",
    "/administration",
    "/teachers",
    "/academics",
    "/admission",
    "/results",
    "/notices",
    "/gallery",
    "/downloads",
    "/contact",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  return entries;
}
