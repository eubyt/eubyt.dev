const eslintConfig = require('@config/eslint-config');

module.exports = {
    ...eslintConfig,
    settings: {
        tailwindcss: {
            config: './tailwind.config.js',
            whitelist: ['bg-alt\\-(black)'],
        },
    },
};
