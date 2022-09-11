/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class', '[theme="dark"]'],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'alt-black': '#0e0e0f',
                black: '#000',
            },
        },
    },
    plugins: [],
};
