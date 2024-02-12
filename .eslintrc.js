module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true,
    },
    extends: [
        'plugin:vue/base',
        'plugin:vue/vue3-essential',
        'plugin:vue/vue3-strongly-recommended',
        'plugin:vue/vue3-recommended',
        'airbnb',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'heildionis-plugin',
        'unused-imports',
    ],
    rules: {
        'unused-imports/no-unused-imports': 'error',
        'react/jsx-filename-extension': [
            2,
            {
                extensions: ['.js', '.jsx', '.tsx'],
            },
        ],
        'import/no-unresolved': 'off',
        'import/prefer-default-export': 'off',
        'object-curly-newline': 'off',
        'no-unused-vars': 'warn',
        'no-shadow': 'off',
        'import/order': [
            'error',
            {
                pathGroups: [
                    {
                        pattern: '@/**',
                        group: 'internal',
                        position: 'after',
                    },
                ],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: false,
                },
            },
        ],
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-underscore-dangle': 'off',
        'max-len': [
            'error',
            {
                ignoreComments: true,
                code: 140,
            },
        ],
        'jsx-quotes': ['error', 'prefer-single'],
        'no-param-reassign': 'off',
        'linebreak-style': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'no-undef': 'off',
        'heildionis-plugin/path-checker': [2, { alias: '@' }],
        'heildionis-plugin/public-api-imports': [
            'error',
            {
                alias: '@',
                testFilesPatterns: [
                    '**/*.test.*',
                ],
            },
        ],
        'heildionis-plugin/layer-imports': [
            'error',
            {
                alias: '@',
                ignoreImportPatterns: [
                    '**/StoreProvider',
                    '**/testing',
                    '**/componentRender',
                ],
            },
        ],
    },
};