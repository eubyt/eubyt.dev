import me from "@/config/me.json";
import type { Locale } from "@/lib/locale";

export { me };

export function profileFor(locale: Locale) {
    return me.profile[locale];
}

export function hobbyFor(locale: Locale) {
    return me.hobby[locale];
}

export function metaFor(locale: Locale) {
    return me.meta[locale];
}

export function projectsFor(locale: Locale) {
    return me.projects.map((project) => ({
        id: project.id,
        title: project.title,
        href: project.localizePath
            ? `${project.href.replace(/\/+$/, "")}/${locale}`
            : project.href,
        repo: project.repo,
        description: project.description[locale],
    }));
}

export { personJsonLd } from "./person-json-ld";
export * from "./tools-redirect";
