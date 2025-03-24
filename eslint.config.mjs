import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslint from "eslint/config";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslint.globalIgnores(["**/node_modules/*", "**/dist/*", "**/build/*", "**/coverage/*", "**/.next/*", "**/out/*", "**/public/*"])
];