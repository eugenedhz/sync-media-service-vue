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
    parser:  'vue-eslint-parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: false,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: '@typescript-eslint/parser'
    },
    plugins: [
        '@typescript-eslint',
        'heildionis-plugin',
        'unused-imports',
    ],
    rules: {
        'vue/multi-word-component-names': 'off',
        'vue/valid-template-root': 'off',
        'unused-imports/no-unused-imports': 'error',
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
        'no-param-reassign': 'off',
        'linebreak-style': 'off',
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