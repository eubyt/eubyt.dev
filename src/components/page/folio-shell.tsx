"use client";

import type { ReactNode } from "react";
import { DrawToggle } from "@/components/draw";
import {
    GridIntersection,
    GridLineH,
    GridVerticalGuides,
} from "@/components/grid";
import { LanguageToggle } from "@/components/locale";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { TextLink } from "@/components/ui/text-link";
import { useLocale } from "@/providers/locale";

const SOURCE_CODE_URL = "https://github.com/eubyt/eubyt.dev";

type FolioShellProps = {
    children: ReactNode;
    /** Optional nav before the language / draw / theme toggles (e.g. back link). */
    leadingNav?: ReactNode;
};

export function FolioShell({ children, leadingNav }: FolioShellProps) {
    const { t } = useLocale();

    return (
        <div className="flex flex-1 justify-center px-5 sm:px-0">
            <div className="relative flex w-full max-w-folio flex-col self-stretch">
                <GridVerticalGuides />
                <div className="relative z-20 mt-5 flex w-full flex-col items-start sm:mt-20">
                    <div className="relative flex w-full items-center gap-3.5 pt-6 pb-4 sm:gap-6 sm:pt-10 sm:pb-6">
                        <GridLineH className="top-0" />
                        <GridIntersection corner="top-left" />
                        <GridIntersection corner="top-right" />

                        <div className="flex w-full flex-col gap-4">
                            <div className="flex w-full items-center justify-end gap-0 sm:gap-1">
                                {leadingNav ? (
                                    <>
                                        <div className="mr-auto flex items-center">
                                            {leadingNav}
                                        </div>
                                        <div
                                            aria-hidden
                                            className="mx-1.5 h-5 w-px shrink-0 bg-border"
                                        />
                                    </>
                                ) : null}
                                <LanguageToggle />
                                <div
                                    aria-hidden
                                    className="mx-1.5 h-5 w-px shrink-0 bg-border"
                                />
                                <DrawToggle />
                                <div
                                    aria-hidden
                                    className="mx-1.5 h-5 w-px shrink-0 bg-border"
                                />
                                <ThemeToggle />
                            </div>

                            <main className="flex flex-col gap-4">
                                {children}
                            </main>

                            <footer className="flex items-center justify-between gap-4 pt-2 pb-6 text-caption text-muted-foreground sm:pb-10">
                                <p>{t("footer.credit")}</p>
                                <TextLink
                                    href={SOURCE_CODE_URL}
                                    external
                                    className="shrink-0 text-caption"
                                >
                                    {t("footer.sourceCode")}
                                </TextLink>
                            </footer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
