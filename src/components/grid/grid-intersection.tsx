import { cn } from "@/utils/cn";

const corners = {
  "top-left": "top-0 -left-6 -translate-x-1/2 -translate-y-1/2",
  "top-right": "top-0 -right-6 translate-x-1/2 -translate-y-1/2",
  "bottom-left": "bottom-0 -left-6 -translate-x-1/2 translate-y-1/2",
  "bottom-right": "bottom-0 -right-6 translate-x-1/2 translate-y-1/2",
  "mid-left": "top-1/2 -left-6 -translate-x-1/2 -translate-y-1/2",
  "mid-right": "top-1/2 -right-6 translate-x-1/2 -translate-y-1/2",
} as const;

export type GridIntersectionCorner = keyof typeof corners;

type GridIntersectionProps = {
  corner?: GridIntersectionCorner;
  className?: string;
};

export function GridIntersection({
  corner,
  className,
}: GridIntersectionProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "grid-intersection hidden sm:block",
        corner && corners[corner],
        className
      )}
    />
  );
}
