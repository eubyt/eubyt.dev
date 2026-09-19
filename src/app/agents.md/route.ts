import { NextResponse } from "next/server";
import me from "@/config/me.json";
import { originFromRequest } from "@/lib/site/origin";
import { socialLabels, type SocialNetwork } from "@/lib/socials";

export function GET(request: Request) {
    const origin = originFromRequest(request);

    const socialNames = me.socials.portfolio
        .map((s) => socialLabels[s.network as SocialNetwork])
        .join(", ");

    const emailLines = me.emails.map(
        (email) => `- [${email.address}](mailto:${email.address})`,
    );

    const body = [
        "# Agents",
        "",
        `**${me.name}** is a ${me.role} known online as **${me.handle}**. This site is his personal portfolio and bio: who he is, what he builds, and how to contact him.`,
        "",
        `Prefer [llms.txt](${origin}/llms.txt), the HTML pages linked there, or the machine-readable portfolio JSON ([EN](${origin}/en/about.json) / [PT](${origin}/pt/about.json)) over scraping the interactive UI.`,
        "",
        "## Who he is",
        "",
        `- Full name: ${me.name}`,
        `- Handle / brand: ${me.handle}`,
        `- Role: ${me.role}`,
        `- Site: ${origin}`,
        `- Location: ${me.location}`,
        "",
        "## Contact",
        "",
        ...emailLines,
        "",
        `Social profiles: ${socialNames} — see the portfolio pages.`,
        "",
    ].join("\n");

    return new NextResponse(body, {
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    });
}
