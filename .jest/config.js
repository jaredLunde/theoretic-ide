const path = require("path");
const tsconfig = require("../tsconfig.json");

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  collectCoverageFrom: ["**/*.{ts,tsx}"],
  coverageDirectory: ".jest/coverage",
  globals: {
    "split-tests": { junit: "./.jest/test-results.xml" },
  },
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleNameMapper: {
    ...Object.keys(tsconfig.compilerOptions.paths).reduce((acc, tsPath) => {
      acc[`^${tsPath.replace("*", "(.*)$")}`] = path.join(
        "<rootDir>",
        tsconfig.compilerOptions.paths[tsPath][0].replace("*", "$1")
      );
      return acc;
    }, {}),
  },
  rootDir: path.join(__dirname, "../"),
  setupFilesAfterEnv: ["<rootDir>/.jest/setup.ts"],
  testEnvironment: "jsdom",
  testMatch: ["**/*.test.{js,jsx,ts,tsx}"],
  testSequencer: "@split-tests/jest",
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc-node/jest",
      {
        react: {
          runtime: "automatic",
          useBuiltins: true,
        },
      },
    ],
  },
  transformIgnorePatterns: [],
};
