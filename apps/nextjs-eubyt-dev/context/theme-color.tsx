import React, { createContext, useEffect, useMemo, useState } from 'react';

type ThemeType = 'dark' | 'light' | 'system' | 'loading';

const ThemeColor = createContext<{
    setTheme: (theme: ThemeType) => void;
    themeActive: ThemeType;
}>({
    setTheme: () => undefined,
    themeActive: 'loading',
});

const ThemeContextProvider: React.FC<{ children: JSX.Element[] | JSX.Element }> = ({
    children,
}) => {
    const nameAttr = 'theme';
    const eventTheme = new Event('themeUpdate');
    const [themeActive, setThemeActive] = useState<ThemeType>('loading');

    const setTheme = (theme: ThemeType) => {
        if (theme === 'system') {
            localStorage.removeItem(nameAttr);
        } else {
            localStorage[nameAttr] = theme;
        }

        document.dispatchEvent(eventTheme);
    };

    const value = useMemo(
        () => ({
            setTheme,
            themeActive,
        }),
        [themeActive, setTheme]
    );

    useEffect(() => {
        const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');

        const onChangeTheme = () => {
            setThemeActive(
                nameAttr in localStorage ? (localStorage[nameAttr] as ThemeType) : 'system'
            );

            if (
                localStorage.theme === 'dark' ||
                (!(nameAttr in localStorage) && matchMedia.matches)
            ) {
                document.documentElement.setAttribute(nameAttr, 'dark');
            } else {
                document.documentElement.removeAttribute(nameAttr);
            }
        };

        // Change theme in System
        matchMedia.addEventListener('change', onChangeTheme);

        // Change theme Manual
        document.addEventListener('themeUpdate', onChangeTheme, false);

        // First Loading page
        onChangeTheme();

        return () => {
            matchMedia.removeEventListener('change', onChangeTheme);
            document.removeEventListener('themeUpdate', onChangeTheme, false);
        };
    });

    return <ThemeColor.Provider value={value}>{children}</ThemeColor.Provider>;
};

export type { ThemeType };
export { ThemeColor, ThemeContextProvider };
