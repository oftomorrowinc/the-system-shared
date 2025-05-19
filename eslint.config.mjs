import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Make sure to ignore dist files first
  {
    ignores: [
      "**/node_modules/**/*",
      "**/dist/**/*",
      "**/build/**/*",
      "**/coverage/**/*",
      "**/.next/**/*",
      "**/out/**/*",
      "**/public/**/*"
    ]
  },
  
  // Default configuration for all files
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier, // Add Prettier config to ESLint
  
  // Global rule adjustments for all files
  {
    rules: {
      // Temporarily disable the rule for this release
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn"
    }
  },
  
  // Special rules for example files
  {
    files: ["examples/**/*.js"],
    rules: {
      "no-undef": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-console": "off"
    }
  },
  
  // Special rules for test files
  {
    files: ["**/__tests__/**/*.ts"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "warn"
    }
  },
  
  // Special rules for configuration files
  {
    files: ["jest.config.js"],
    rules: {
      "no-undef": "off"
    }
  }
];