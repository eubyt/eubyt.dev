import { NextResponse } from "next/server";
import { LOCALES } from "@/lib/locale";
import { me, metaFor } from "@/lib/site";
import { originFromRequest } from "@/lib/site/origin";

export function GET(request: Request) {
  const origin = originFromRequest(request);

  const pages = LOCALES.flatMap((locale) => {
    const meta = metaFor(locale);
    const label = locale === "en" ? "EN" : "PT";
    return [
      `- [Portfolio (${label})](${origin}/${locale}): ${meta.home.description}`,
      `- [Portfolio JSON (${label})](${origin}/${locale}/about.json): Machine-readable portfolio`,
      `- [Hobbies (${label})](${origin}/${locale}/hobby): ${meta.hobby.description}`,
    ];
  });

  const body = [
    `# ${me.name}`,
    "",
    `> Personal site / portfolio of ${me.name} (${me.handle}), ${me.role}.`,
    "",
    "## Pages",
    "",
    ...pages,
    "",
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
