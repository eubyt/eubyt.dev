"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import {
    DEFAULT_DRAW_COLOR,
    getToolStrokeWidth,
    normalizeHexColor,
    type DrawTool,
    type StrokeSize,
} from "./draw-utils";

export {
    DRAW_TOOLS,
    STROKE_SIZES,
    type DrawTool,
    type StrokeSize,
} from "./draw-utils";

type DrawModeContextValue = {
    active: boolean;
    setActive: (active: boolean) => void;
    tool: DrawTool;
    setTool: (tool: DrawTool) => void;
    color: string;
    setColor: (color: string) => void;
    strokeSize: StrokeSize;
    setStrokeSize: (size: StrokeSize) => void;
    strokeWidth: number;
    clearVersion: number;
    clear: () => void;
};

const DrawModeContext = createContext<DrawModeContextValue | null>(null);

export function DrawModeProvider({ children }: { children: ReactNode }) {
    const [active, setActive] = useState(false);
    const [tool, setTool] = useState<DrawTool>("pen");
    const [color, setColorState] = useState(DEFAULT_DRAW_COLOR);
    const [strokeSize, setStrokeSize] = useState<StrokeSize>("medium");
    const [clearVersion, setClearVersion] = useState(0);

    const strokeWidth = getToolStrokeWidth(tool, strokeSize);

    const setColor = useCallback((next: string) => {
        setColorState(normalizeHexColor(next));
    }, []);

    const clear = useCallback(() => {
        setClearVersion((v) => v + 1);
    }, []);

    const value = useMemo(
        () => ({
            active,
            setActive,
            tool,
            setTool,
            color,
            setColor,
            strokeSize,
            setStrokeSize,
            strokeWidth,
            clearVersion,
            clear,
        }),
        [
            active,
            tool,
            color,
            setColor,
            strokeSize,
            strokeWidth,
            clearVersion,
            clear,
        ],
    );

    return (
        <DrawModeContext.Provider value={value}>
            {children}
        </DrawModeContext.Provider>
    );
}

export function useDrawMode() {
    const context = useContext(DrawModeContext);
    if (!context) {
        throw new Error("useDrawMode must be used within DrawModeProvider");
    }
    return context;
}
