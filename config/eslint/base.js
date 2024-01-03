//https://github.com/t3-oss/create-t3-turbo/blob/main/tooling/eslint/base.js
//https://github.com/exbotanical/eslint-config/blob/master/packages/react/index.js
/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  ignorePatterns: [
    '**/.eslintrc.cjs',
    '**/*.config.js',
    '**/*.config.cjs',
    '.next',
    'node_modules',
    '.eslintrc.cjs',
    'dist',
    'pnpm-lock.yaml',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'turbo',
    'eslint:recommended',
    //https://typescript-eslint.io/linting/typed-linting/monorepos
    //https://typescript-eslint.io/linting/configs
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    //https://github.com/prettier/eslint-plugin-prettier?tab=readme-ov-file#recommended-configuration
    'plugin:prettier/recommended',
  ],
  env: {
    es2022: true,
    node: true,
  },
  parserOptions: {
    project: true,
    tsconfigRootDir: '.',
    extraFileExtensions: ['.svelte'],
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
  reportUnusedDisableDirectives: true,
  rules: {
    'turbo/no-undeclared-env-vars': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'array-bracket-spacing': ['error', 'never'],
    curly: ['error', 'all'],
    'block-scoped-var': 'error',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-extraneous-class': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
    ],
    '@typescript-eslint/no-misused-promises': [2, { checksVoidReturn: { attributes: false } }],
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
  },
};

module.exports = config;
