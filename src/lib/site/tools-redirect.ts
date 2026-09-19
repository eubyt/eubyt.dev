import type { NextRequest } from "next/server";
import me from "@/config/me.json";
import { isLocale, resolveBrowserLocale, type Locale } from "@/lib/locale";

export const TOOLS_ORIGIN = me.sites.tools.replace(/\/+$/, "");

export const TOOLS_PATH_REGEX =
    /^(?:\/([a-zA-Z]{2}(?:-[a-zA-Z]{2})?))?\/tools(?:\/(.*))?$/i;

export function getToolsOriginFromHost(
    host?: string | null,
    proto = "https",
    envUrl = process.env.TOOLS_URL || process.env.NEXT_PUBLIC_TOOLS_URL,
): string {
    if (envUrl) {
        return envUrl.replace(/\/+$/, "");
    }

    if (!host) {
        return TOOLS_ORIGIN;
    }

    const cleanHost = host.split(",")[0].trim();
    if (
        cleanHost.includes("localhost") ||
        cleanHost.startsWith("127.") ||
        cleanHost.endsWith(".vercel.app")
    ) {
        return TOOLS_ORIGIN;
    }

    const normalizedProto = (proto || "https").split(",")[0].trim();
    const withoutWww = cleanHost.replace(/^www\./, "");
    const toolsHost = withoutWww.startsWith("tools.")
        ? withoutWww
        : `tools.${withoutWww}`;

    return `${normalizedProto}://${toolsHost}`;
}

export function getToolsRedirectUrl(
    request: NextRequest,
    options?: { envUrl?: string },
): URL | null {
    const { pathname, search } = request.nextUrl;
    const match = pathname.match(TOOLS_PATH_REGEX);
    if (!match) return null;

    const rawLang = match[1]?.toLowerCase();
    let targetLocale: Locale;
    if (rawLang) {
        targetLocale = isLocale(rawLang)
            ? rawLang
            : resolveBrowserLocale(rawLang);
    } else {
        const header = request.headers.get("accept-language");
        const primary = header?.split(",")[0]?.trim() ?? "en";
        targetLocale = resolveBrowserLocale(primary);
    }

    const rawSubpath = match[2]?.replace(/^\/+|\/+$/g, "");
    const targetPath = rawSubpath
        ? `/${targetLocale}/tools/${rawSubpath}`
        : `/${targetLocale}`;

    const host =
        request.headers.get("x-forwarded-host") ??
        request.headers.get("host") ??
        request.nextUrl.host;
    const proto =
        request.headers.get("x-forwarded-proto") ??
        (request.nextUrl.protocol
            ? request.nextUrl.protocol.replace(":", "")
            : "https");

    const origin = getToolsOriginFromHost(host, proto, options?.envUrl);
    return new URL(`${targetPath}${search}`, origin);
}
