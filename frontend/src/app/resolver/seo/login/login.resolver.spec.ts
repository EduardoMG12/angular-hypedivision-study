import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";

import { LoginResolver } from "./login.resolver";

describe("LoginResolver", () => {
	const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
		TestBed.runInInjectionContext(() => LoginResolver(...resolverParameters));

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it("should be created", () => {
		expect(executeResolver).toBeTruthy();
	});
});
