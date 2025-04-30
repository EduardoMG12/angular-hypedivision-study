import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";

import { CreateFlashcardResolver } from "./create-flashcard.resolver";

describe("createFlascardResolver", () => {
	const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
		TestBed.runInInjectionContext(() =>
			CreateFlashcardResolver(...resolverParameters),
		);

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it("should be created", () => {
		expect(executeResolver).toBeTruthy();
	});
});
