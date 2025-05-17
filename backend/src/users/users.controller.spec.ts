import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

import { User } from "src/entities/user.entity";
import { SafeUser } from "src/auth/dto/safe-user.dto";
import { makeUser } from "src/common/mock/test/mock-users.mock";
import { NotFoundException } from "@nestjs/common";

describe("UsersController", () => {
	let usersController: UsersController;
	let usersService: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				{
					provide: UsersService,
					useValue: {
						createUser: jest.fn(),
						findByEmail: jest.fn(),
						findById: jest.fn(),
						findByPhone: jest.fn(),
						validateUserUniqueness: jest.fn(),
					} as Partial<Record<keyof UsersService, jest.Mock>>,
				},
			],
		}).compile();

		usersController = module.get<UsersController>(UsersController);

		usersService = module.get<UsersService>(
			UsersService,
		) as jest.Mocked<UsersService>;
	});

	it("should be defined", () => {
		expect(usersController).toBeDefined();
		expect(usersService).toBeDefined();
	});

	describe("getProfile", () => {
		it("should return the user profile as SafeUser", async () => {
			const { fakeUser } = makeUser();
			const userId = fakeUser.id;

			jest.spyOn(usersService, "findById").mockResolvedValue(fakeUser as User);

			const expectedSafeUser: SafeUser = {
				id: fakeUser.id,
				email: fakeUser.email,
				fullName: fakeUser.fullName,
				phone: fakeUser.phone,
				birthdate: fakeUser.birthdate,
				created_at: fakeUser.created_at,
			};

			const result = await usersController.getProfile(userId);

			expect(usersService.findById).toHaveBeenCalledWith(userId);

			expect(result).toEqual(expect.objectContaining(expectedSafeUser));
		});

		it("should throw NotFoundException if user is not found", async () => {
			const userId = "nonexistent-user-id";

			jest
				.spyOn(usersService, "findById")
				.mockRejectedValue(new NotFoundException());

			await expect(usersController.getProfile(userId)).rejects.toThrow(
				NotFoundException,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
		});
	});
});
