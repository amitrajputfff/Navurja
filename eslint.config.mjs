import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // mobile/ and vendor/ are separate, independent Expo projects (own
    // package.json each, own React Native-flavored lint concerns — e.g.
    // RN's <Image> has no `alt` prop, and Metro configs are plain
    // CommonJS) — not part of this Next.js app. Same reasoning as their
    // tsconfig.json exclusions.
    "mobile/**",
    "vendor/**",
  ]),
]);

export default eslintConfig;
