import { defineConfig, globalIgnores } from 'eslint/config';
import next from 'eslint-config-next';

const eslintConfig = defineConfig([
  ...next,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    'node_modules/**',
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    rules: {
      // Disable strict React Compiler rules
      'react-hooks/refs': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/use-memo': 'off',
      // Relax exhaustive-deps to warning
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]);

export default eslintConfig;
