"use client";

import { profileFor } from "@/lib/site";
import { useLocale } from "@/providers/locale";

export function AboutBio() {
  const { locale, t } = useLocale();
  const paragraphs = profileFor(locale).about;

  return (
    <section aria-label={t("profile.aboutLabel")} className="w-full py-2">
      <div className="flex flex-col gap-4 text-body font-book text-muted-foreground">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-pretty">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
