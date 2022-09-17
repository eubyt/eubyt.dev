import React, { useRef, useState } from 'react';
import { useContext } from 'react';
import { ThemeColor } from '../context/theme-color';
import type { ThemeType } from '../context/theme-color';
import { CgSun, CgMoon, CgDesktop } from 'react-icons/cg';
import Card from './card';

const SwitchTheme = () => {
    const { setTheme, themeActive } = useContext(ThemeColor);
    const [open, setOpen] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    const optionsSwitch: Array<{
        name: string;
        icon: JSX.Element;
        theme: ThemeType;
    }> = [
        {
            name: 'Escuro',
            icon: <CgMoon />,
            theme: 'dark',
        },
        {
            name: 'Claro',
            icon: <CgSun />,
            theme: 'light',
        },
        {
            name: 'Sistema',
            icon: <CgDesktop />,
            theme: 'system',
        },
    ];

    const onClick = () => {
        setOpen(!open);
        const mouseDownEvent = (doc: MouseEvent) => {
            if (
                !cardRef.current?.contains(doc.target as HTMLElement) &&
                !buttonRef.current?.contains(doc.target as HTMLElement)
            ) {
                setOpen(false);
                document.documentElement.removeEventListener('mousedown', mouseDownEvent);
            }
        };

        document.documentElement.addEventListener('mousedown', mouseDownEvent);
    };

    return (
        <>
            <div ref={buttonRef}>
                <button
                    className="relative text-4xl text-zinc-800 delay-200 hover:!text-slate-400 hover:transition-all dark:text-white"
                    onClick={onClick}
                >
                    <span className="dark:hidden">
                        <CgMoon />
                    </span>
                    <span className="hidden dark:block">
                        <CgSun />
                    </span>
                </button>
            </div>

            {open && (
                <Card padding="py-3 absolute top-20 rounded-lg">
                    <div
                        className="flex w-36 flex-col space-y-4 text-zinc-800 dark:text-white"
                        ref={cardRef}
                    >
                        {optionsSwitch.map((option) => (
                            <button
                                className="flex items-center py-2 px-3 hover:bg-zinc-300 disabled:bg-zinc-300 dark:hover:bg-stone-700 dark:disabled:bg-stone-700"
                                key={option.name}
                                disabled={themeActive === option.theme}
                                onClick={() => {
                                    setTheme(option.theme);
                                }}
                            >
                                <span className="mr-2 text-2xl">{option.icon}</span>
                                {option.name}
                            </button>
                        ))}
                    </div>
                </Card>
            )}
        </>
    );
};

export default SwitchTheme;
