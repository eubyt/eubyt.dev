"use client";

import { LuPaintbrush } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/providers/locale";
import { cn } from "@/utils/cn";
import { useDrawMode } from "./draw-mode";

type DrawToggleProps = {
  className?: string;
};

export function DrawToggle({ className }: DrawToggleProps) {
  const { active, setActive } = useDrawMode();
  const t = useTranslations();
  const label = active ? t("draw.exit") : t("draw.enter");

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "size-11 cursor-pointer bg-transparent hover:bg-transparent dark:hover:bg-transparent",
              active && "text-foreground",
              className,
            )}
            aria-label={label}
            aria-pressed={active}
            onClick={() => setActive(!active)}
          />
        }
      >
        <LuPaintbrush
          aria-hidden
          className="theme-toggle-icon size-[1.125rem]"
        />
      </TooltipTrigger>
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  );
}
