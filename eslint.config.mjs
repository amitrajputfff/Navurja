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
    // mobile/ is a separate, independent Expo project (own package.json,
    // own React Native-flavored lint concerns — e.g. RN's <Image> has no
    // `alt` prop, and Metro configs are plain CommonJS) — not part of
    // this Next.js app. Same reasoning as its tsconfig.json exclusion.
    "mobile/**",
  ]),
]);

export default eslintConfig;
