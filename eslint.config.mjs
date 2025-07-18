import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow any type
      "@typescript-eslint/no-explicit-any": "off",

      // Allow unused variables
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",

      // Allow unused imports
      "@typescript-eslint/no-unused-imports": "off",

      // Allow empty object types
      "@typescript-eslint/ban-types": "off",

      // Allow empty interfaces
      "@typescript-eslint/no-empty-interface": "off",

      // Allow console logs
      "no-console": "off",
    },
  },
];

export default eslintConfig;
