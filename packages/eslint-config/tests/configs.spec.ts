import { Linter } from 'eslint';
import { describe, expect, it } from 'vitest';
import reactConfig from '../src/configs/react.mjs';
import tsBaseConfig from '../src/configs/ts-base.mjs';
import vitestConfig from '../vitest.config.cjs';

const configs = [
  { name: 'react', config: reactConfig, filename: 'avi.tsx' },
  { name: 'ts-base', config: tsBaseConfig, filename: 'avi.ts' },
  { name: 'vitest', config: vitestConfig, filename: 'avi.test.ts' },
];

describe('configs', function () {
  it.each(configs)('$name should be a valid eslint config', function (testObject) {
    const linter = new Linter({ configType: 'flat' });
    const action = () => linter.verify('const a = 1', testObject.config as object, { filename: testObject.filename });

    expect(action).not.toThrow();
  });
});
