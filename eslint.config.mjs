import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

/** @type {import('eslint').Linter.Config[]} */
const config = [
  // Global ignores
  {
    ignores: [
      'node_modules',
      '.next',
      'dist',
      '.sanity',
      'coverage',
      'package-lock.json',
      'pnpm-lock.yaml',
      '*.d.ts',
      'scripts/**/*.js',
      'apps/studio/dist/**',
      'apps/studio/**/*.js',
    ],
  },

  // Base Next.js + TypeScript configs
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Prettier integration
  ...compat.extends('prettier'),

  // Custom rules for JS/TS files
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    rules: {
      'prefer-const': 'error',
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
]

export default config
