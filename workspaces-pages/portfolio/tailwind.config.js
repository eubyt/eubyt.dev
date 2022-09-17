/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class', '[theme="dark"]'],
    content: ['./pages/*.{html,jsx,tsx}', './components/*.{html,jsx,tsx}'],
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
