"use client";

import { useSyncExternalStore } from "react";
import { LuMonitor, LuMoon } from "react-icons/lu";
import { SunIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cycleTheme, withViewTransition, type Theme } from "@/lib/theme";
import { useTheme } from "@/providers/theme";

const icons = {
  light: { Icon: SunIcon, className: "theme-toggle-sun" },
  dark: { Icon: LuMoon, className: "theme-toggle-moon" },
  system: { Icon: LuMonitor, className: "theme-toggle-system" },
} as const;

const labels: Record<Theme, string> = {
  light: "Clique para trocar para tema escuro",
  dark: "Clique para trocar para tema claro",
  system: "Clique para trocar para tema do sistema",
};

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const current = icons[theme];
  const Icon = current.Icon;
  const label = mounted ? labels[theme] : "Alternar tema";

  const handleThemeChange = () => {
    withViewTransition(() => {
      setTheme(cycleTheme(theme));
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="fixed top-4 right-4 z-50 cursor-pointer rounded-md border-border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground dark:bg-card"
            aria-label={label}
            onClick={handleThemeChange}
          />
        }
      >
        <span
          key={mounted ? theme : "pending"}
          className="inline-flex animate-in fade-in zoom-in-95 duration-200"
        >
          {mounted ? (
            <Icon
              aria-hidden
              className={`theme-toggle-icon ${current.className}`}
            />
          ) : (
            <SunIcon className="theme-toggle-icon" />
          )}
        </span>
        <span className="sr-only">Alternar tema</span>
      </TooltipTrigger>
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  );
}
