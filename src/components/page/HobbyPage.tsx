"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { GridIntersection, GridLineH } from "@/components/grid";
import { FolioShell } from "@/components/page/folio-shell";
import { TextLink, textLinkVariants } from "@/components/ui/text-link";
import { withLocale } from "@/lib/locale";
import { hobbyFor } from "@/lib/site";
import {
  socialIcons,
  socialLabels,
  type SocialLink,
} from "@/lib/socials";
import { useLocale } from "@/providers/locale";
import { cn } from "@/utils/cn";

type HobbyPageProps = {
  socials: SocialLink[];
};

/** Minimal markdown: `[label](https://…)`. */
function RichParagraph({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const [, label, href] = match;
    parts.push(
      <TextLink
        key={`${href}-${match.index}`}
        href={href}
        external
        className="text-foreground underline decoration-border underline-offset-2 hover:decoration-foreground"
      >
        {label}
      </TextLink>,
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <p className="text-pretty">{parts}</p>;
}

export function HobbyPage({ socials }: HobbyPageProps) {
  const { locale, t } = useLocale();
  const topics = hobbyFor(locale).topics;

  return (
    <FolioShell
      leadingNav={
        <Link
          href={withLocale(locale)}
          className={cn(textLinkVariants({ size: "text" }))}
        >
          {t("hobby.back")}
        </Link>
      }
    >
      <section
        aria-labelledby="hobby-heading"
        className="relative flex w-full flex-col py-5"
      >
        <GridLineH className="top-0" />
        <GridIntersection corner="top-left" />
        <GridIntersection corner="top-right" />

        <h1
          id="hobby-heading"
          className="text-display font-display tracking-display text-balance text-foreground"
        >
          {t("hobby.title")}
        </h1>

        <div className="mt-8 flex flex-col gap-8">
          {topics.map((topic, index) => {
            const headingId = `hobby-topic-${index + 1}`;

            return (
              <article key={topic.title} aria-labelledby={headingId}>
                <h2
                  id={headingId}
                  className="text-role font-display tracking-role text-foreground"
                >
                  {topic.title}
                </h2>

                <div className="mt-4 flex flex-col gap-4 text-body font-book text-muted-foreground">
                  {topic.paragraphs.map((paragraph) => (
                    <RichParagraph key={paragraph} text={paragraph} />
                  ))}
                </div>
              </article>
            );
          })}

          <article aria-labelledby="hobby-socials-heading">
            <h2
              id="hobby-socials-heading"
              className="text-role font-display tracking-role text-foreground"
            >
              {t("hobby.socialsLabel")}
            </h2>

            <ul className="mt-4 flex flex-col gap-2.5">
              {socials.map(({ network, href }) => {
                const Icon = socialIcons[network];
                const label = socialLabels[network];

                return (
                  <li key={network}>
                    <TextLink
                      href={href}
                      external
                      className="inline-flex items-center gap-2 text-body font-book text-foreground underline decoration-border underline-offset-2 hover:decoration-foreground"
                    >
                      <Icon
                        aria-hidden
                        className="size-3.5 shrink-0 opacity-80"
                      />
                      {label}
                    </TextLink>
                  </li>
                );
              })}
            </ul>
          </article>
        </div>

        <GridLineH className="bottom-0" />
        <GridIntersection corner="bottom-left" />
        <GridIntersection corner="bottom-right" />
      </section>
    </FolioShell>
  );
}
