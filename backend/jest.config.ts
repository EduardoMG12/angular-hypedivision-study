import type { JestConfigWithTsJest } from "ts-jest";

import { compilerOptions } from "./tsconfig.json";

const jestConfig: JestConfigWithTsJest = {
	modulePaths: [compilerOptions.baseUrl],
	moduleFileExtensions: ["js", "json", "ts"],
	testRegex: "..spec.ts$",
	transform: {
		"^.+.(t|j)s$": "ts-jest",
	},
	collectCoverageFrom: ["**/.ts"],
	coverageDirectory: "coverage",
	testEnvironment: "node",
};

export default jestConfig;
