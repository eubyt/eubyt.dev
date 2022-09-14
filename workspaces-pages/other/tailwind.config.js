/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class', '[theme="dark"]'],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                black: '#000',
            },
        },
    },
    plugins: [],
};
