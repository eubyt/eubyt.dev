module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ['xo', 'prettier'],
    overrides: [
        {
            extends: ['xo-typescript', 'prettier'],
            files: ['*.ts', '*.tsx'],
        },
        {
            plugins: ['react', 'tailwindcss'],
            extends: [
                'xo-typescript',
                'prettier',
                'plugin:tailwindcss/recommended',
                'plugin:react/recommended',
            ],
            files: ['*.tsx', '*.jsx'],
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [],
    rules: {},
};
