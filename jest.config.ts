import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // Use jsdom for Next.js compatibility
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  testMatch: ["**/*.test.ts"],
  setupFiles: ["<rootDir>/.jest/setEnvVars.js"], // Load environment variables
};
