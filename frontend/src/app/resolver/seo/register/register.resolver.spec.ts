import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";

import { RegisterResolver } from "./register.resolver";

describe("RegisterResolver", () => {
	const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
		TestBed.runInInjectionContext(() =>
			RegisterResolver(...resolverParameters),
		);

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it("should be created", () => {
		expect(executeResolver).toBeTruthy();
	});
});
