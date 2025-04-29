import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import {
	mockAuthService,
	MockAuthServiceType,
	createMockRegisterDto,
	createMockLoginDto,
	createExpectedSafeUser,
	createExpectedAccessToken,
} from "src/common/mock/test/mock-auth.mock";

describe("AuthController", () => {
	let controller: AuthController;
	let mockAuthServiceInstance: MockAuthServiceType;

	beforeEach(async () => {
		mockAuthServiceInstance = mockAuthService();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: mockAuthServiceInstance,
				},
			],
		}).compile();

		controller = module.get<AuthController>(AuthController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	describe("register", () => {
		it("should register a new user and return SafeUser", async () => {
			const registerDto = createMockRegisterDto();
			const expectedSafeUser = createExpectedSafeUser({
				email: registerDto.email,
				fullName: registerDto.fullName,
			});
			mockAuthServiceInstance.register.mockResolvedValue(expectedSafeUser);

			const result = await controller.register(registerDto);

			expect(mockAuthServiceInstance.register).toHaveBeenCalledWith(
				registerDto,
			);
			expect(result).toEqual(expectedSafeUser);
		});

		it("should throw BadRequestException if register fails", async () => {
			const registerDto = createMockRegisterDto({
				email: "invalid-email",
				fullName: "Invalid Name",
				password: "short",
			});
			mockAuthServiceInstance.register.mockRejectedValue(
				new BadRequestException(),
			);

			await expect(controller.register(registerDto)).rejects.toThrow(
				BadRequestException,
			);
			expect(mockAuthServiceInstance.register).toHaveBeenCalledWith(
				registerDto,
			);
		});
	});

	describe("login", () => {
		it("should login user and return AccessToken", async () => {
			const loginDto = createMockLoginDto();
			const expectedAccessToken = createExpectedAccessToken();
			mockAuthServiceInstance.login.mockResolvedValue(expectedAccessToken);

			const result = await controller.login(loginDto);

			expect(mockAuthServiceInstance.login).toHaveBeenCalledWith(loginDto);
			expect(result).toEqual(expectedAccessToken);
		});

		it("should throw UnauthorizedException if login fails", async () => {
			const loginDto = createMockLoginDto({ password: "wrong-password" });
			mockAuthServiceInstance.login.mockRejectedValue(
				new UnauthorizedException(),
			);

			await expect(controller.login(loginDto)).rejects.toThrow(
				UnauthorizedException,
			);
			expect(mockAuthServiceInstance.login).toHaveBeenCalledWith(loginDto);
		});
	});
});
