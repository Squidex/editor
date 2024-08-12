module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'eslint-plugin-import',
    'react-refresh'
  ],
  rules: {
    'react-hooks/exhaustive-deps': [
      'warn', 
      { additionalHooks: '' }
    ],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/semi': 'error',
    '@typescript-eslint/indent': [
      'warn',
      4
    ],
    'import/order': ['error', {
        'pathGroupsExcludedImportTypes': ['builtin'],
        'alphabetize': {
            'order': 'asc'
        }
    }],
    'no-trailing-spaces': 'error',
    'sort-imports': [
        'error',
        {
            'ignoreCase': true,
            'ignoreDeclarationSort': true
        }
    ],
  },
}
