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

// package.json
// "jest": {
// 	"moduleFileExtensions": ["js", "json", "ts"],
// 	"rootDir": "src",
// 	"testRegex": ".*\\.spec\\.ts$",
// 	"transform": {
// 		"^.+\\.(t|j)s$": "ts-jest"
// 	},
// 	"collectCoverageFrom": [
// 		"**/*.(t|j)s",
// 		"!**/*.entity.(t|j)s",
// 		"!**/migrations/*.(t|j)s",
// 		"!**/*.module.(t|j)s",
// 		"!**/main.(t|j)s",
// 		"!**/*.dto.(t|j)s"
// 	],
// 	"coverageDirectory": "../coverage",
// 	"testEnvironment": "node"
// },
