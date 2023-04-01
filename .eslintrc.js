module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'prettier'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
        'plugin:prettier/recommended',
      ],
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
      rules: {
        'prettier/prettier': [
          'error',
          {
            endOfLine: 'auto',
          },
        ],
        'array-bracket-spacing': ['error', 'never'],
        curly: ['error', 'all'],
        'block-scoped-var': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],
        '@typescript-eslint/member-delimiter-style': [
          'error',
          {
            singleline: {
              requireLast: false,
            },
          },
        ],
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
      },
    },
    {
      files: ['*.ts'],
      plugins: ['prettier'],
      extends: ['prettier', 'plugin:prettier/recommended'],
    },
  ],
};
