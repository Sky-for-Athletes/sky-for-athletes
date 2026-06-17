import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // The "you might not need an effect" guidance this rule cites is about
      // derived state, not async data fetching — React's own docs still
      // endorse fetch-in-effect-with-loading-state. Downgraded since this
      // codebase doesn't use Suspense/a data-fetching library.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
])
