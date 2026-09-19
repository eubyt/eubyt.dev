import me from "@/config/me.json";

export function personJsonLd(siteUrl: string) {
    const sameAs = [
        ...new Set([
            ...me.socials.portfolio.map((s) => s.href),
            ...me.socials.hobby.map((s) => s.href),
        ]),
    ];

    return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: me.name,
        alternateName: me.handle,
        jobTitle: me.profile.en.jobTitle,
        email: me.emails.map((email) => email.address),
        url: siteUrl,
        sameAs,
    };
}
