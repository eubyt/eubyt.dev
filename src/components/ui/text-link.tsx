import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";

const textLinkVariants = cva(
  "rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      size: {
        icon: "inline-flex size-8 items-center justify-center [&_svg]:size-4",
        text: "inline-flex items-center gap-1.5 text-xs sm:text-sm",
      },
    },
    defaultVariants: {
      size: "text",
    },
  },
);

type TextLinkProps = ComponentProps<"a"> &
  VariantProps<typeof textLinkVariants> & {
    external?: boolean;
  };

function TextLink({
  className,
  size,
  external = false,
  children,
  ...props
}: TextLinkProps) {
  return (
    <a
      data-slot="text-link"
      className={cn(textLinkVariants({ size, className }))}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : undefined)}
      {...props}
    >
      {children}
    </a>
  );
}

export { TextLink, textLinkVariants };
