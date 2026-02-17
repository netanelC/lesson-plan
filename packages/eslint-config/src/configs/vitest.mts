import type vitestPluginType from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';
import { importOrThrow } from '../internal/helpers.js';

const vitestPlugin = await importOrThrow<typeof vitestPluginType>('@vitest/eslint-plugin');

const vitestRules = defineConfig([{
  name: 'vitest/rules',
  files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
  plugins: { vitest: vitestPlugin },
  rules: {
    ...vitestPlugin.configs.recommended.rules,
    'vitest/expect-expect': ['error', { assertFunctionNames: ['expect', 'expectTypeOf', 'expectResponseStatus'] }],
    'vitest/padding-around-all': 'warn',
    'vitest/prefer-expect-resolves': 'warn',
    'vitest/prefer-hooks-in-order': 'warn',
    'vitest/prefer-to-have-length': 'warn',
    'vitest/prefer-strict-boolean-matchers': 'warn',
    'vitest/require-top-level-describe': 'warn',
    'vitest/prefer-equality-matcher': 'warn',
    'vitest/valid-title': ['warn', { mustMatch: { it: ['^should .+.$'] } }],
  },
}]);

/**
 * Vitest ESLint configuration
 *
 * Provides ESLint rules for Vitest tests, including:
 * - Vitest recommended rules
 * - Custom test validation rules
 * - Proper test file pattern matching (*.test.ts, *.spec.tsx, etc.)
 *
 * @group configs
 * @example
 * import vitestConfig from '@repo/eslint-config/vitest';
 *
 * export default vitestConfig;
 */
export default vitestRules;