import type reactPluginType from 'eslint-plugin-react';
import type { plugin } from 'typescript-eslint';
import type tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import { importOrThrow } from '../internal/helpers.js';
import tsBaseConfig from './ts-base.mjs';

type PluginReactHooks = typeof plugin & { configs: { recommended: { rules: tseslint.ConfigWithExtends['rules'] } } };

const reactPlugin = await importOrThrow<typeof reactPluginType>('eslint-plugin-react');
const pluginReactHooks = await importOrThrow<PluginReactHooks>('eslint-plugin-react-hooks');
const importedGlobals = await importOrThrow<{ browser: Exclude<tseslint.ConfigArray[0]['languageOptions'], undefined>['globals'] }>('globals');

const reactRules = defineConfig([reactPlugin.configs.flat.recommended ?? {}, reactPlugin.configs.flat['jsx-runtime'] ?? {}, {
  name: 'react/rules',
  files: ['**/*.tsx'],
  languageOptions: {
    globals: importedGlobals.browser,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/boolean-prop-naming': 'error',
    'react/hook-use-state': 'error',
    'react/prop-types': 'off',
  },
}]);

const reactHooksRules = defineConfig([{
  name: 'react-hooks/rules',
  files: ['**/*.tsx'],
  plugins: { 'react-hooks': pluginReactHooks },
  rules: pluginReactHooks.configs.recommended.rules,
}]);

const typeScriptReactOverrides = defineConfig([{
  name: 'typescript-eslint/react-overrides',
  files: ['**/*.tsx', '**/*.ts'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
  },
}]);

/**
 * Combined React and React Hooks ESLint configuration
 *
 * Provides ESLint rules for React and React Hooks, including:
 * - TypeScript base configuration
 * - React recommended rules
 * - JSX runtime configuration
 * - Browser globals
 * - React version detection
 * - Custom React rules (boolean prop naming, useState hook usage)
 * - React Hooks recommended rules
 * - TypeScript rule overrides (explicit function return types disabled for TSX files)
 *
 * @group configs
 * @example
 * import reactConfig from '@repo/eslint-config/react';
 *
 * export default reactConfig;
 */
export default defineConfig([...tsBaseConfig, ...reactRules, ...reactHooksRules, ...typeScriptReactOverrides]);