"use client";

import Link from "next/link";
import { GridIntersection, GridLineH } from "@/components/grid";
import { buttonVariants } from "@/components/ui/button";
import { withLocale } from "@/lib/locale";
import { hobbyFor } from "@/lib/site";
import { useLocale } from "@/providers/locale";
import { cn } from "@/utils/cn";

export function Hobbies() {
  const { locale, t } = useLocale();

  return (
    <section
      aria-labelledby="hobbies-heading"
      className="relative flex w-full flex-col py-5"
    >
      <h2
        id="hobbies-heading"
        className="text-role font-display tracking-role text-foreground"
      >
        {t("hobbies.label")}
      </h2>

      <p className="mt-4 text-body font-book text-pretty text-muted-foreground">
        {hobbyFor(locale).teaser}
      </p>

      <Link
        href={withLocale(locale, "/hobby")}
        className={cn(
          buttonVariants({ variant: "outline", size: "default" }),
          "mt-5 w-fit text-foreground",
        )}
      >
        {t("hobbies.cta")}
      </Link>

      <GridLineH className="bottom-0" />
      <GridIntersection corner="bottom-left" />
      <GridIntersection corner="bottom-right" />
    </section>
  );
}
