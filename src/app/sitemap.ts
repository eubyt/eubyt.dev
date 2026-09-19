import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/locale";
import { siteOrigin } from "@/lib/site/origin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await siteOrigin();
  const now = new Date();

  const localized: MetadataRoute.Sitemap = LOCALES.flatMap((locale) => [
    {
      url: `${origin}/${locale}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${origin}/${locale}/hobby`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ]);

  return [
    ...localized,
    {
      url: `${origin}/llms.txt`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${origin}/agents.md`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
