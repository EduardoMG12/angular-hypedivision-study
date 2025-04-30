import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";

import { DevelopmentResolver } from "./development.resolver";

describe("developmentResolver", () => {
	const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
		TestBed.runInInjectionContext(() =>
			DevelopmentResolver(...resolverParameters),
		);

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it("should be created", () => {
		expect(executeResolver).toBeTruthy();
	});
});
