import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";

import { NotFoundResolver } from "./not-found.resolver";

describe("statisticsResolver", () => {
	const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
		TestBed.runInInjectionContext(() =>
			NotFoundResolver(...resolverParameters),
		);

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it("should be created", () => {
		expect(executeResolver).toBeTruthy();
	});
});
