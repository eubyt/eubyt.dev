import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import {
    getToolsOriginFromHost,
    getToolsRedirectUrl,
    TOOLS_PATH_REGEX,
} from "./tools-redirect";
import { proxy } from "@/proxy";

describe("TOOLS_PATH_REGEX", () => {
    it("matches /tools and /tools/", () => {
        expect(TOOLS_PATH_REGEX.test("/tools")).toBe(true);
        expect(TOOLS_PATH_REGEX.test("/tools/")).toBe(true);
        expect(TOOLS_PATH_REGEX.test("/TOOLS")).toBe(true);
    });

    it("matches /:lang/tools and /:lang/tools/", () => {
        expect(TOOLS_PATH_REGEX.test("/pt/tools")).toBe(true);
        expect(TOOLS_PATH_REGEX.test("/pt/tools/")).toBe(true);
        expect(TOOLS_PATH_REGEX.test("/en/tools")).toBe(true);
        expect(TOOLS_PATH_REGEX.test("/en/tools/")).toBe(true);
    });

    it("matches subpaths after tools", () => {
        expect(TOOLS_PATH_REGEX.test("/tools/uuid-tool")).toBe(true);
        expect(TOOLS_PATH_REGEX.test("/pt/tools/hash-generator")).toBe(true);
        expect(TOOLS_PATH_REGEX.test("/en/tools/jwt-decoder-tool/info")).toBe(
            true,
        );
    });

    it("does not match unrelated paths", () => {
        expect(TOOLS_PATH_REGEX.test("/")).toBe(false);
        expect(TOOLS_PATH_REGEX.test("/pt")).toBe(false);
        expect(TOOLS_PATH_REGEX.test("/hobby")).toBe(false);
        expect(TOOLS_PATH_REGEX.test("/pt/hobby")).toBe(false);
        expect(TOOLS_PATH_REGEX.test("/about.json")).toBe(false);
        expect(TOOLS_PATH_REGEX.test("/tools-guide")).toBe(false);
        expect(TOOLS_PATH_REGEX.test("/pt/tools-guide")).toBe(false);
    });
});

describe("getToolsOriginFromHost", () => {
    it("derives tools subdomain from standard domains", () => {
        expect(getToolsOriginFromHost("eubyt.dev")).toBe(
            "https://tools.eubyt.dev",
        );
        expect(getToolsOriginFromHost("www.eubyt.dev")).toBe(
            "https://tools.eubyt.dev",
        );
        expect(getToolsOriginFromHost("eubyt.com")).toBe(
            "https://tools.eubyt.com",
        );
        expect(getToolsOriginFromHost("www.eubyt.com")).toBe(
            "https://tools.eubyt.com",
        );
        expect(getToolsOriginFromHost("tools.eubyt.dev")).toBe(
            "https://tools.eubyt.dev",
        );
    });

    it("falls back to tools.eubyt.dev for localhost and preview domains", () => {
        expect(getToolsOriginFromHost("localhost:3000", "http")).toBe(
            "https://tools.eubyt.dev",
        );
        expect(getToolsOriginFromHost("127.0.0.1:3000", "http")).toBe(
            "https://tools.eubyt.dev",
        );
        expect(getToolsOriginFromHost("preview-123.vercel.app")).toBe(
            "https://tools.eubyt.dev",
        );
        expect(getToolsOriginFromHost(null)).toBe("https://tools.eubyt.dev");
    });

    it("respects envUrl if provided", () => {
        expect(
            getToolsOriginFromHost(
                "localhost:3000",
                "http",
                "http://localhost:3001/",
            ),
        ).toBe("http://localhost:3001");
    });
});

describe("getToolsRedirectUrl", () => {
    it("redirects /tools and /tools/ to detected locale root", () => {
        const reqPt = new NextRequest("https://eubyt.dev/tools", {
            headers: { "accept-language": "pt-BR,pt;q=0.9" },
        });
        expect(getToolsRedirectUrl(reqPt)?.toString()).toBe(
            "https://tools.eubyt.dev/pt",
        );

        const reqEn = new NextRequest("https://eubyt.dev/tools/", {
            headers: { "accept-language": "en-US,en;q=0.9" },
        });
        expect(getToolsRedirectUrl(reqEn)?.toString()).toBe(
            "https://tools.eubyt.dev/en",
        );
    });

    it("redirects /:lang/tools and /:lang/tools/ to target locale root", () => {
        const reqPt = new NextRequest("https://eubyt.dev/pt/tools");
        expect(getToolsRedirectUrl(reqPt)?.toString()).toBe(
            "https://tools.eubyt.dev/pt",
        );

        const reqPtSlash = new NextRequest("https://eubyt.dev/pt/tools/");
        expect(getToolsRedirectUrl(reqPtSlash)?.toString()).toBe(
            "https://tools.eubyt.dev/pt",
        );

        const reqEn = new NextRequest("https://eubyt.dev/en/tools");
        expect(getToolsRedirectUrl(reqEn)?.toString()).toBe(
            "https://tools.eubyt.dev/en",
        );

        const reqEnSlash = new NextRequest("https://eubyt.dev/en/tools/");
        expect(getToolsRedirectUrl(reqEnSlash)?.toString()).toBe(
            "https://tools.eubyt.dev/en",
        );
    });

    it("redirects tool subpaths preserving the tool route and locale", () => {
        const reqWithLocale = new NextRequest(
            "https://eubyt.dev/pt/tools/hash-generator",
        );
        expect(getToolsRedirectUrl(reqWithLocale)?.toString()).toBe(
            "https://tools.eubyt.dev/pt/tools/hash-generator",
        );

        const reqWithoutLocale = new NextRequest(
            "https://eubyt.dev/tools/uuid-tool",
            {
                headers: { "accept-language": "pt-BR" },
            },
        );
        expect(getToolsRedirectUrl(reqWithoutLocale)?.toString()).toBe(
            "https://tools.eubyt.dev/pt/tools/uuid-tool",
        );
    });

    it("preserves query search parameters", () => {
        const req = new NextRequest(
            "https://eubyt.dev/pt/tools?search=base64&tab=1",
        );
        expect(getToolsRedirectUrl(req)?.toString()).toBe(
            "https://tools.eubyt.dev/pt?search=base64&tab=1",
        );

        const reqTool = new NextRequest(
            "https://eubyt.dev/en/tools/uuid-tool?version=4",
        );
        expect(getToolsRedirectUrl(reqTool)?.toString()).toBe(
            "https://tools.eubyt.dev/en/tools/uuid-tool?version=4",
        );
    });

    it("derives origin dynamically from forwarded host", () => {
        const req = new NextRequest("https://eubyt.com/pt/tools", {
            headers: {
                "x-forwarded-host": "eubyt.com",
            },
        });
        expect(getToolsRedirectUrl(req)?.toString()).toBe(
            "https://tools.eubyt.com/pt",
        );
    });

    it("returns null for non-tools routes", () => {
        expect(
            getToolsRedirectUrl(new NextRequest("https://eubyt.dev/")),
        ).toBeNull();
        expect(
            getToolsRedirectUrl(new NextRequest("https://eubyt.dev/pt")),
        ).toBeNull();
        expect(
            getToolsRedirectUrl(new NextRequest("https://eubyt.dev/hobby")),
        ).toBeNull();
        expect(
            getToolsRedirectUrl(new NextRequest("https://eubyt.dev/pt/hobby")),
        ).toBeNull();
    });
});

describe("proxy middleware integration", () => {
    it("redirects /tools to tools domain", () => {
        const req = new NextRequest("https://eubyt.dev/tools", {
            headers: { "accept-language": "pt-BR" },
        });
        const res = proxy(req);
        expect(res.status).toBe(307);
        expect(res.headers.get("location")).toBe("https://tools.eubyt.dev/pt");
    });

    it("redirects /pt/tools/ to tools domain", () => {
        const req = new NextRequest("https://eubyt.dev/pt/tools/");
        const res = proxy(req);
        expect(res.status).toBe(307);
        expect(res.headers.get("location")).toBe("https://tools.eubyt.dev/pt");
    });

    it("redirects /pt/tools/hash-generator to tools domain tool page", () => {
        const req = new NextRequest(
            "https://eubyt.dev/pt/tools/hash-generator",
        );
        const res = proxy(req);
        expect(res.status).toBe(307);
        expect(res.headers.get("location")).toBe(
            "https://tools.eubyt.dev/pt/tools/hash-generator",
        );
    });

    it("does not intercept regular portfolio paths", () => {
        const req = new NextRequest("https://eubyt.dev/pt/hobby");
        const res = proxy(req);
        expect(res.headers.get("location")).toBeNull();
    });
});
