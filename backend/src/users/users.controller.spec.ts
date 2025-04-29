import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { NotFoundException } from "@nestjs/common";
import {
	mockUsersService,
	MockUsersServiceType,
	createExpectedSafeUser,
} from "../common/mock/test/mock-users.mock";

describe("UsersController", () => {
	let controller: UsersController;
	let mockUsersServiceInstance: MockUsersServiceType;

	beforeEach(async () => {
		mockUsersServiceInstance = mockUsersService();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				{
					provide: UsersService,
					useValue: mockUsersServiceInstance,
				},
			],
		}).compile();

		controller = module.get<UsersController>(UsersController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	describe("getProfile", () => {
		it("should return the user profile", async () => {
			const userId = "some-user-id";
			const expectedSafeUser = createExpectedSafeUser({ id: userId });
			mockUsersServiceInstance.findById.mockResolvedValue(expectedSafeUser);

			const mockRequest = { user: { id: userId } };

			// 2. Act (Ação)
			const result = await controller.getProfile(mockRequest);

			// 3. Assert (Verificações)
			expect(mockUsersServiceInstance.findById).toHaveBeenCalledWith(userId);
			expect(result).toEqual(expectedSafeUser);
		});
	});

	describe("getProfile", () => {
		it("should throw NotFoundException if user is not found", async () => {
			const userId = "nonexistent-user-id";
			mockUsersServiceInstance.findById.mockRejectedValue(
				new NotFoundException(),
			);

			const mockRequest = { user: { id: userId } };

			await expect(controller.getProfile(mockRequest)).rejects.toThrowError(
				NotFoundException,
			);
			expect(mockUsersServiceInstance.findById).toHaveBeenCalledWith(userId);
		});
	});
});
