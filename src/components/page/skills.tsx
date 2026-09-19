"use client";

import type { IconType } from "react-icons";
import { FaAws } from "react-icons/fa6";
import {
    SiDocker,
    SiGo,
    SiGooglecloud,
    SiGraphql,
    SiJavascript,
    SiMongodb,
    SiMysql,
    SiNestjs,
    SiNextdotjs,
    SiNodedotjs,
    SiPostgresql,
    SiRedis,
    SiShopify,
    SiTypescript,
} from "react-icons/si";
import { GridIntersection, GridLineH } from "@/components/grid";
import { useLocale } from "@/providers/locale";

const skillIcons = {
    TypeScript: SiTypescript,
    JavaScript: SiJavascript,
    "Node.js": SiNodedotjs,
    NestJS: SiNestjs,
    "Next.js": SiNextdotjs,
    Go: SiGo,
    GraphQL: SiGraphql,
    PostgreSQL: SiPostgresql,
    MySQL: SiMysql,
    MongoDB: SiMongodb,
    Redis: SiRedis,
    Docker: SiDocker,
    "Google Cloud": SiGooglecloud,
    AWS: FaAws,
    Shopify: SiShopify,
} as const satisfies Record<string, IconType>;

export type SkillName = keyof typeof skillIcons;

export type SkillCategory = "languages" | "data" | "ecommerce";

export type SkillGroup = {
    category: SkillCategory;
    skills: SkillName[];
};

type SkillsProps = {
    groups: SkillGroup[];
};

export function Skills({ groups }: SkillsProps) {
    const { t } = useLocale();

    return (
        <section
            aria-labelledby="skills-heading"
            className="relative flex w-full flex-col py-5"
        >
            <GridLineH className="top-0" />
            <GridIntersection corner="top-left" />
            <GridIntersection corner="top-right" />

            <h2
                id="skills-heading"
                className="text-role font-display tracking-role text-foreground"
            >
                {t("skills.label")}
            </h2>

            <div className="mt-5 flex flex-col gap-6">
                {groups.map(({ category, skills }) => (
                    <div key={category} className="flex flex-col gap-3">
                        <p className="text-body font-book text-muted-foreground">
                            {t(`skills.categories.${category}`)}
                        </p>
                        <ul className="flex flex-wrap gap-x-3.5 gap-y-2.5">
                            {skills.map((label) => {
                                const Icon = skillIcons[label];

                                return (
                                    <li
                                        key={label}
                                        className="inline-flex items-center gap-1.5 text-body font-book text-foreground"
                                    >
                                        <Icon
                                            aria-hidden
                                            className="size-3.5 shrink-0 opacity-80"
                                        />
                                        {label}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>

            <GridLineH className="bottom-0" />
            <GridIntersection corner="bottom-left" />
            <GridIntersection corner="bottom-right" />
        </section>
    );
}
