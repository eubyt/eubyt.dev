import React from 'react';

const Card: React.FC<{
    children: JSX.Element[] | JSX.Element;
    padding?: string;
    className?: string;
}> = ({ children, padding = 'p-6', className }) => (
    <div
        className={`rounded-lg bg-zinc-100 ${padding} shadow-sm shadow-neutral-400/50 dark:bg-stone-900 dark:shadow-black/50${
            className ? ` ${className}` : ''
        }`}
    >
        {children}
    </div>
);

export default Card;
