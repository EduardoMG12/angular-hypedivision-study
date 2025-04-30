import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";

import { WelcomeResolver } from "./welcome.resolver";

describe("welcomeResolverResolver", () => {
	const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
		TestBed.runInInjectionContext(() => WelcomeResolver(...resolverParameters));

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it("should be created", () => {
		expect(executeResolver).toBeTruthy();
	});
});
