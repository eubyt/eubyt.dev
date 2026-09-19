"use client";

import {
    cloneElement,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
} from "react";
import { GitHubCalendar, type Activity } from "react-github-calendar";
import "react-github-calendar/tooltips.css";
import { resolveTheme } from "@/lib/theme";
import { useLocale } from "@/providers/locale";
import { useTheme } from "@/providers/theme";

const USERNAME = "eubyt";
const BLOCK_MARGIN = 2;
const BLOCK_SIZE = 12;
const MAX_WEEKS = 53;
const DAY_MS = 86_400_000;
const emptySubscribe = () => () => {};

function weeksForWidth(width: number) {
    const weeks = Math.floor(
        (width + BLOCK_MARGIN) / (BLOCK_SIZE + BLOCK_MARGIN),
    );
    return Math.max(12, Math.min(MAX_WEEKS, weeks));
}

function selectLastWeeks(data: Activity[], weekCount: number) {
    const days = weekCount * 7;
    if (data.length <= days) return data;
    return data.slice(data.length - days);
}

function animationDelay(date: string, rangeStart: string) {
    if (!rangeStart) return "0ms";
    const days = Math.round(
        (Date.parse(`${date}T00:00:00Z`) -
            Date.parse(`${rangeStart}T00:00:00Z`)) /
            DAY_MS,
    );
    return `${Math.max(0, days) * 3}ms`;
}

function formatCommitTooltip(
    activity: Pick<Activity, "date" | "count">,
    t: (key: string, params?: Record<string, string | number>) => string,
    monthsLong: string[],
) {
    const [year, month, day] = activity.date.split("-").map(Number);
    const params = {
        count: activity.count,
        day: day!,
        month: monthsLong[month! - 1] ?? "",
        year: year!,
    };

    if (activity.count === 0) {
        return t("github.commitTooltipZero", params);
    }
    if (activity.count === 1) {
        return t("github.commitTooltipOne", params);
    }
    return t("github.commitTooltip", params);
}

export function GithubContributions() {
    const rootRef = useRef<HTMLElement>(null);
    const rangeStartRef = useRef("");
    const [weeks, setWeeks] = useState(MAX_WEEKS);
    const { theme } = useTheme();
    const { messages, t } = useLocale();
    // Calendar + resolveTheme(system) read the browser; only mount on client.
    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );
    const colorScheme = resolveTheme(theme);
    const labels = messages.github.labels;

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const update = () => {
            setWeeks(weeksForWidth(root.clientWidth));
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(root);
        return () => observer.disconnect();
    }, [mounted]);

    return (
        <section
            ref={rootRef}
            aria-label={t("github.label")}
            className="github-contributions w-full py-2"
        >
            {mounted ? (
                <GitHubCalendar
                    username={USERNAME}
                    colorScheme={colorScheme}
                    blockSize={BLOCK_SIZE}
                    blockMargin={BLOCK_MARGIN}
                    fontSize={11}
                    showColorLegend={false}
                    showTotalCount={false}
                    transformData={(data) => {
                        const sliced = selectLastWeeks(data, weeks);
                        rangeStartRef.current = sliced[0]?.date ?? "";
                        return sliced;
                    }}
                    labels={{
                        months: labels.months,
                    }}
                    tooltips={{
                        activity: {
                            text: (activity) =>
                                formatCommitTooltip(
                                    activity,
                                    t,
                                    labels.monthsLong,
                                ),
                        },
                    }}
                    renderBlock={(block, activity) => {
                        const delay = animationDelay(
                            activity.date,
                            rangeStartRef.current,
                        );
                        const animated = cloneElement(block, {
                            style: {
                                ...block.props.style,
                                animationDelay: delay,
                            },
                        });

                        if (activity.count <= 0) return animated;

                        const x = Number(block.props.x ?? 0);
                        const y = Number(block.props.y ?? 0);
                        const size = Number(block.props.width ?? BLOCK_SIZE);
                        const label =
                            activity.count > 99
                                ? "99+"
                                : String(activity.count);

                        return (
                            <g>
                                {animated}
                                <text
                                    x={x + size / 2}
                                    y={y + size / 2}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className="github-contrib-count"
                                    fill={
                                        activity.level >= 3
                                            ? "#fff"
                                            : "var(--foreground)"
                                    }
                                    style={{
                                        fontSize: Math.max(6, size * 0.48),
                                        animationDelay: delay,
                                    }}
                                >
                                    {label}
                                </text>
                            </g>
                        );
                    }}
                />
            ) : null}
        </section>
    );
}
