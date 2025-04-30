import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";

import { welcomeResolverResolver } from "./deck.resolver";

describe("welcomeResolverResolver", () => {
	const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
		TestBed.runInInjectionContext(() =>
			welcomeResolverResolver(...resolverParameters),
		);

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it("should be created", () => {
		expect(executeResolver).toBeTruthy();
	});
});
