"use client";

import { GridIntersection, GridLineH } from "@/components/grid";
import { TextLink } from "@/components/ui/text-link";
import { TOOLS_ORIGIN } from "@/lib/site";
import { useLocale } from "@/providers/locale";

const toolsHost = new URL(TOOLS_ORIGIN).host;

export function PersonalProjects() {
    const { locale, t } = useLocale();

    return (
        <section
            aria-labelledby="personal-projects-heading"
            className="relative flex w-full flex-col py-5"
        >
            <h2
                id="personal-projects-heading"
                className="text-role font-display tracking-role text-foreground"
            >
                {t("personalProjects.label")}
            </h2>

            <p className="mt-4 text-body font-book text-pretty text-muted-foreground">
                {t("personalProjects.description")}{" "}
                <TextLink href={`${TOOLS_ORIGIN}/${locale}`} external>
                    {toolsHost}
                </TextLink>
            </p>

            <GridLineH className="bottom-0" />
            <GridIntersection corner="bottom-left" />
            <GridIntersection corner="bottom-right" />
        </section>
    );
}
