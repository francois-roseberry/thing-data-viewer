module.exports = {
  root: true,
  env: {
    es2021: true,
  },
  plugins: ['unused-imports'],
  extends: [
    'standard',
    'plugin:promise/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended'
  ],
  rules: {
    'promise/prefer-await-to-then': 'warn',
    'promise/always-return': 'warn',
    'promise/catch-or-return': 'warn',
    'no-console': 'off',
    'prefer-template': 2,
    'sort-imports': 'off',

    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
    'import/order': ['error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true }
      }
    ],
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'error',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'import/no-namespace': 'error',

    'unused-imports/no-unused-imports': 'error'
  },
  ignorePatterns: ['tsconfig.json', 'dist', 'coverage'],
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'standard-with-typescript',
        'plugin:import/typescript',
        'plugin:prettier/recommended'
      ],
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      rules: {
        'lodash/import-scope': 0,
        'no-new': 'off',
        '@typescript-eslint/switch-exhaustiveness-check': 'warn',
        '@typescript-eslint/prefer-return-this-type': 'warn',
        '@typescript-eslint/prefer-optional-chain': 'warn',
        '@typescript-eslint/prefer-readonly': 'warn',
        '@typescript-eslint/prefer-includes': 'warn',

        'unused-imports/no-unused-imports-ts': 'error',

        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/return-await': 'error',

        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/restrict-template-expressions': ['error', { allowNullish: true }],
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],

        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',

        'consistent-return': 'off',
        'default-case': 'off',

        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE']
          },
          {
            selector: 'variable',
            leadingUnderscore: 'allow',
            format: ['strictCamelCase'],
            filter: '^_id$'
          },
          {
            selector: 'function',
            format: ['camelCase', 'PascalCase']
          },
          {
            selector: 'typeLike',
            format: ['PascalCase']
          }
        ],
        '@typescript-eslint/no-unsafe-argument': 'off'
      },
    },
    {
      files: ['*.spec.ts', '*-spec.ts', '**/__{mocks,tests}__/**/*.ts'],
      extends: ['plugin:jest/recommended', 'plugin:jest/style', 'plugin:jest-formatting/recommended'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 0,
        'import/no-namespace': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off'
      },
    },
  ],
}
