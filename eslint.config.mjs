// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_', // Ignore parameters starting with underscore
                    varsIgnorePattern: '^_', // Ignore variables starting with underscore
                    caughtErrorsIgnorePattern: '^_', // Ignore caught errors starting with underscore
                },
            ],
            '@typescript-eslint/no-empty-object-type': 'off',
        },
    },
);
