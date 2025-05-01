import { Test, TestingModule } from "@nestjs/testing";
import {
	BadRequestException,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AccessToken } from "./dto/accessToken.dto";
import { SafeUserWithJwt } from "./dto/safeUserWithJwt";
import { ValidateTokenDto } from "./dto/validateToken.dto";
import { UserTermsAcceptance } from "src/entities/userTermsAcceptance.entity";
import { TermsOfUse } from "src/entities/termsOfUse.entity";
import { User } from "src/entities/user.entity";
import { AcceptTermsDto } from "./dto/user-terms-acceptance.dto";

const makeTermsOfUse = (
	id = "fake-terms-id",
	version = "1.0",
	content = "Termos de Uso Fake",
	isActive = true,
	createdAt = new Date(),
	updatedAt = new Date(),
): TermsOfUse => ({
	id,
	version,
	content,
	isActive,
	createdAt,
	updatedAt,
});

const makeMockUser = (
	id: string,
	email = "mockuser@example.com",
	fullName = "Mock User",
	password = "hashed_password",
	phone = "11999999999",
	cpfOrCnpj = "12345678901",
	birthdate = new Date(),
	createdAt = new Date(),
	updatedAt = new Date(),
	created_at = new Date(),
	updated_at = new Date(),
	deleted_at = null,
): User =>
	({
		id,
		email,
		fullName,
		password,
		phone,
		cpfOrCnpj,
		birthdate,
		createdAt,
		updatedAt,
		created_at,
		updated_at,
		deleted_at,
	}) as User;

const makeUserTermsAcceptance = (
	userId: string,
	termsOfUseId: string,
	termsVersion: string,
	id = "fake-acceptance-id",
	acceptedAt = new Date(),
): UserTermsAcceptance =>
	({
		id,
		user: makeMockUser(userId),
		termsOfUse: makeTermsOfUse(termsOfUseId, termsVersion),
		termsVersion,
		acceptedAt,
	}) as UserTermsAcceptance;

let mockToPlainToInstance: jest.Mock;

jest.mock("./../common/utils/toPlainToInstance", () => ({
	toPlainToInstance: jest.fn(),
}));

describe("AuthController", () => {
	let authController: AuthController;
	let authService: jest.Mocked<AuthService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: {
						register: jest.fn(),
						login: jest.fn(),
						validateToken: jest.fn(),
						acceptTerms: jest.fn(),
					},
				},
			],
		}).compile();

		authController = module.get<AuthController>(AuthController);
		authService = module.get(AuthService) as jest.Mocked<AuthService>;

		mockToPlainToInstance = jest.fn();

		const mockedModule = require("./../common/utils/toPlainToInstance");
		mockedModule.toPlainToInstance = mockToPlainToInstance;

		mockToPlainToInstance.mockClear();

		mockToPlainToInstance.mockImplementation((cls: any, plain: any) => plain);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(authController).toBeDefined();
	});

	describe("register", () => {
		it("should call authService.register and return the transformed result", async () => {
			const registerDto: RegisterDto = {
				email: "test@example.com",
				password: "password123",
				fullName: "Test User",
				phone: "11999999999",
				cpfOrCnpj: "12345678901",
				birthdate: new Date("1990-01-01"),
				accept_terms: true,
			};
			const serviceResult: SafeUserWithJwt = {
				id: "user-id",
				email: registerDto.email,
				fullName: registerDto.fullName,
				access_token: "fake-jwt",
				phone: registerDto.phone,
				cpfOrCnpj: registerDto.cpfOrCnpj,
				birthdate: registerDto.birthdate,
				created_at: new Date(),
			} as SafeUserWithJwt;

			const transformedResult: SafeUserWithJwt = {
				...serviceResult,
			};

			authService.register.mockResolvedValue(serviceResult);
			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await authController.register(registerDto);

			expect(authService.register).toHaveBeenCalledWith(registerDto);
			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				SafeUserWithJwt,
				serviceResult,
			);
			expect(result).toEqual(transformedResult);
		});

		it("should throw the exception thrown by authService.register", async () => {
			const registerDto: RegisterDto = {
				email: "test@example.com",
				password: "password123",
				fullName: "Test User",
				phone: "11999999999",
				cpfOrCnpj: "12345678901",
				birthdate: new Date("1990-01-01"),
				accept_terms: true,
			};
			const serviceError = new BadRequestException("Invalid data");

			authService.register.mockRejectedValue(serviceError);

			await expect(authController.register(registerDto)).rejects.toThrow(
				serviceError,
			);

			expect(authService.register).toHaveBeenCalledWith(registerDto);
			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});
	});

	describe("login", () => {
		it("should call authService.login and return the transformed result", async () => {
			const loginDto: LoginDto = {
				email: "test@example.com",
				password: "password123",
			};
			const serviceResult: AccessToken = {
				access_token: "fake-jwt",
			};
			const transformedResult: AccessToken = {
				...serviceResult,
			};

			authService.login.mockResolvedValue(serviceResult);
			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await authController.login(loginDto);

			expect(authService.login).toHaveBeenCalledWith(loginDto);
			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				AccessToken,
				serviceResult,
			);
			expect(result).toEqual(transformedResult);
		});

		it("should throw UnauthorizedException thrown by authService.login", async () => {
			const loginDto: LoginDto = {
				email: "test@example.com",
				password: "password123",
			};
			const serviceError = new UnauthorizedException("Invalid credentials");

			authService.login.mockRejectedValue(serviceError);

			await expect(authController.login(loginDto)).rejects.toThrow(
				serviceError,
			);

			expect(authService.login).toHaveBeenCalledWith(loginDto);
			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});

		it("should throw other exceptions thrown by authService.login", async () => {
			const loginDto: LoginDto = {
				email: "test@example.com",
				password: "password123",
			};
			const serviceError = new BadRequestException("Missing field");

			authService.login.mockRejectedValue(serviceError);

			await expect(authController.login(loginDto)).rejects.toThrow(
				serviceError,
			);

			expect(authService.login).toHaveBeenCalledWith(loginDto);
			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});
	});

	describe("validateToken", () => {
		it("should call authService.validateToken and return the transformed result for a valid token", async () => {
			const authHeader = "Bearer fake-valid-token";
			const token = "fake-valid-token";
			const serviceResult = true;
			const transformedResult: ValidateTokenDto = {
				accessToken: serviceResult,
			};

			authService.validateToken.mockResolvedValue(serviceResult);
			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await authController.validateToken(authHeader);

			expect(authService.validateToken).toHaveBeenCalledWith(token);
			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				ValidateTokenDto,
				serviceResult,
			);
			expect(result).toEqual(transformedResult);
		});

		it("should throw UnauthorizedException if authorization header is missing", async () => {
			const authHeader = undefined;

			await expect(
				authController.validateToken(authHeader as any),
			).rejects.toThrow(
				new UnauthorizedException("Token inválido / Invalid token"),
			);

			expect(authService.validateToken).not.toHaveBeenCalled();
			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});

		it('should throw UnauthorizedException if authorization header is not in "Bearer token" format', async () => {
			const authHeader = "fake-token";

			await expect(authController.validateToken(authHeader)).rejects.toThrow(
				new UnauthorizedException("Token inválido / Invalid token"),
			);

			expect(authService.validateToken).not.toHaveBeenCalled();
			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});

		it("should return transformed result with accessToken: false if authService.validateToken returns false", async () => {
			const authHeader = "Bearer fake-invalid-token";
			const token = "fake-invalid-token";
			const serviceResult = false;
			const transformedResult: ValidateTokenDto = {
				accessToken: serviceResult,
			};

			authService.validateToken.mockResolvedValue(serviceResult);
			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await authController.validateToken(authHeader);

			expect(authService.validateToken).toHaveBeenCalledWith(token);
			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				ValidateTokenDto,
				serviceResult,
			);
			expect(result).toEqual(transformedResult);
		});

		it("should throw UnauthorizedException if authService.validateToken throws", async () => {
			const authHeader = "Bearer fake-expired-token";
			const token = "fake-expired-token";
			const serviceError = new Error("jwt expired");

			authService.validateToken.mockRejectedValue(serviceError);

			await expect(authController.validateToken(authHeader)).rejects.toThrow(
				new UnauthorizedException(
					"Token inválido ou expirado / Token is invalid or expired",
				),
			);

			expect(authService.validateToken).toHaveBeenCalledWith(token);
			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});
	});

	describe("acceptTerms", () => {
		it("should call authService.acceptTerms and return the transformed result", async () => {
			const acceptTermsDto: AcceptTermsDto = { termsOfUseId: "terms-id" };
			const userId = "user-id";
			const termsVersion = "1.0";

			const serviceResult: UserTermsAcceptance = makeUserTermsAcceptance(
				userId,
				acceptTermsDto.termsOfUseId,
				termsVersion,
			);

			const transformedResult: UserTermsAcceptance = serviceResult;

			authService.acceptTerms.mockResolvedValue(serviceResult);
			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await authController.acceptTerms(acceptTermsDto, userId);

			expect(authService.acceptTerms).toHaveBeenCalledWith(
				acceptTermsDto,
				userId,
			);
			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				UserTermsAcceptance,
				serviceResult,
			);
			expect(result).toEqual(transformedResult);
		});

		it("should throw the exception thrown by authService.acceptTerms", async () => {
			const acceptTermsDto: AcceptTermsDto = { termsOfUseId: "terms-id" };
			const userId = "user-id";
			const serviceError = new NotFoundException("Terms not found");

			authService.acceptTerms.mockRejectedValue(serviceError);

			await expect(
				authController.acceptTerms(acceptTermsDto, userId),
			).rejects.toThrow(serviceError);

			expect(authService.acceptTerms).toHaveBeenCalledWith(
				acceptTermsDto,
				userId,
			);
			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});
	});
});
