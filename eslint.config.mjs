import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [{
  files: ['**/*.ts', '**/*.tsx'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: './tsconfig.json',
      sourceType: 'module',
      ecmaVersion: 2020,
    },
  },
  plugins: {
    '@typescript-eslint': eslintPluginTs,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
},
...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
