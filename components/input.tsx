import React from 'react';

const Input = ({
    title,
    placeholder,
    name,
    disabled,
}: {
    title: string;
    placeholder: string;
    name: string;
    disabled?: boolean;
}) => (
    <input
        type="text"
        name={name}
        placeholder={placeholder}
        autoComplete="off"
        title={title}
        disabled={disabled}
        className="w-full rounded-md bg-zinc-200 py-4 text-zinc-800 focus:border-transparent focus:bg-transparent focus:outline-none dark:bg-stone-800 dark:text-white"
    />
);

export default Input;
