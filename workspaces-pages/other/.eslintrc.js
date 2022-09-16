const eslintConfig = require('@config/eslint-config');

eslintConfig.overrides.push({
    extends: ['next'],
    files: ['*.tsx', '*.jsx'],
});

module.exports = {
    ...eslintConfig,
    settings: {
        tailwindcss: {
            config: './tailwind.config.js',
            whitelist: ['bg-alt\\-(black)'],
        },
    },
};
