import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";

import { StatisticsResolver } from "./statistics.resolver";

describe("statisticsResolver", () => {
	const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
		TestBed.runInInjectionContext(() =>
			StatisticsResolver(...resolverParameters),
		);

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it("should be created", () => {
		expect(executeResolver).toBeTruthy();
	});
});
