"use client";

import { useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";
import { TextLink } from "@/components/ui/text-link";
import { toast } from "@/components/ui/toast";
import { useTranslations } from "@/providers/locale";
import { cn } from "@/utils/cn";

type EmailLinkProps = {
    email: string;
    copyable?: boolean;
    className?: string;
};

export function EmailLink({
    email,
    copyable = false,
    className,
}: EmailLinkProps) {
    const t = useTranslations();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            toast.add({
                type: "success",
                title: t("email.copied"),
                description: email,
            });
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
            toast.add({
                type: "error",
                title: t("email.copyFailed"),
            });
        }
    };

    return (
        <span className={cn("inline-flex items-center gap-1", className)}>
            <TextLink href={`mailto:${email}`} size="text">
                <span className="sr-only">{t("email.sendTo")}</span>
                {email}
            </TextLink>
            {copyable ? (
                <button
                    type="button"
                    onClick={handleCopy}
                    aria-label={copied ? t("email.copied") : t("email.copy")}
                    className="inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                    {copied ? (
                        <LuCheck aria-hidden className="size-3.5" />
                    ) : (
                        <LuCopy
                            aria-hidden
                            className="size-3.5 hover:cursor-pointer"
                        />
                    )}
                </button>
            ) : null}
        </span>
    );
}
