"use client";

import { FaGithub } from "react-icons/fa6";
import { GridIntersection, GridLineH } from "@/components/grid";
import { TextLink } from "@/components/ui/text-link";
import { projectsFor } from "@/lib/site";
import { useLocale } from "@/providers/locale";

export function PersonalProjects() {
    const { locale, t } = useLocale();
    const projects = projectsFor(locale);

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

            <ul className="mt-4 flex flex-col gap-5">
                {projects.map((project) => (
                    <li key={project.id} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <TextLink
                                href={project.href}
                                external
                                size="role"
                                className="w-fit text-foreground hover:text-foreground"
                            >
                                {project.title}
                            </TextLink>
                            <TextLink
                                href={project.repo}
                                external
                                size="icon"
                                aria-label={t("personalProjects.repo")}
                            >
                                <FaGithub aria-hidden />
                            </TextLink>
                        </div>
                        <p className="text-caption font-book text-pretty text-muted-foreground">
                            {project.description}
                        </p>
                    </li>
                ))}
            </ul>

            <GridLineH className="bottom-0" />
            <GridIntersection corner="bottom-left" />
            <GridIntersection corner="bottom-right" />
        </section>
    );
}
