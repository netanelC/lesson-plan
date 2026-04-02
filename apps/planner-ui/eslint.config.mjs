import baseConfig from '@repo/eslint-config/ts-base';
import reactConfig from '@repo/eslint-config/react';
import { defineConfig } from 'eslint/config';

export default defineConfig(baseConfig, reactConfig, { ignores: ['vitest.config.ts'], settings: { react: { version: 'detect' } } });
