import { Test, TestingModule } from "@nestjs/testing";
import { GroupDecksController } from "./group-decks.controller";

describe("GroupDecksController", () => {
	let controller: GroupDecksController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GroupDecksController],
		}).compile();

		controller = module.get<GroupDecksController>(GroupDecksController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
