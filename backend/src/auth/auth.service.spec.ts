import { Test, TestingModule } from "@nestjs/testing";
import {
	BadRequestException,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { BcryptAdapter } from "../common/adapter/bcrypt.adapter";
import { TermsOfUseService } from "../terms-of-use/terms-of-use.service";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { SanitizerUtils } from "src/common/utils/sanitize";
import { User } from "src/entities/user.entity";
import { UserTermsAcceptance } from "src/entities/user-terms-acceptance.entity";
import { TermsOfUse } from "src/entities/terms-of-use.entity";
import { AcceptTermsDto } from "./dto/user-terms-acceptance.dto";
import { errorMessages } from "src/common/errors/errors-message";
import { ErrorCode } from "src/common/errors/error-codes.enum";

import { makeUser } from "src/common/mock/test/mock-users.mock";

const makeTermsOfUse = (
	id = "fake-terms-id",
	version = "1.0",
	content = "Termos de Uso Fake",
): TermsOfUse => ({
	id,
	version,
	content,
	isActive: true,
	createdAt: new Date(),
	updatedAt: new Date(),
});

const makeUserTermsAcceptance = (
	userId: string,
	termsOfUseId: string,
	termsVersion: string,
	id = "fake-acceptance-id",
): UserTermsAcceptance => ({
	id,
	user: { id: userId } as User,
	termsOfUse: { id: termsOfUseId, version: termsVersion } as TermsOfUse,
	termsVersion,
	acceptedAt: new Date(),
});

describe("AuthService", () => {
	let authService: AuthService;
	let usersService: jest.Mocked<UsersService>;
	let jwtService: jest.Mocked<JwtService>;
	let bcryptAdapter: jest.Mocked<BcryptAdapter>;
	let termsOfUseService: jest.Mocked<TermsOfUseService>;
	let sanitizerUtilsSpy: {
		phoneNumber: jest.SpyInstance;
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: {
						findByEmail: jest
							.fn<Promise<User | null>, [string, boolean?]>()
							.mockResolvedValue(null),
						validateUserUniqueness: jest.fn(),
						createUser: jest.fn(),
						findById: jest.fn(),
					},
				},
				{
					provide: JwtService,
					useValue: {
						sign: jest.fn(),
						verifyAsync: jest.fn(),
					},
				},
				{
					provide: BcryptAdapter,
					useValue: {
						hash: jest.fn(),
						compare: jest.fn(),
					},
				},
				{
					provide: TermsOfUseService,
					useValue: {
						findActive: jest.fn(),
						findById: jest.fn(),
						acceptTerms: jest.fn(),
					},
				},
			],
		}).compile();

		authService = module.get<AuthService>(AuthService);
		usersService = module.get(UsersService) as jest.Mocked<UsersService>;
		jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
		bcryptAdapter = module.get(BcryptAdapter) as jest.Mocked<BcryptAdapter>;
		termsOfUseService = module.get(
			TermsOfUseService,
		) as jest.Mocked<TermsOfUseService>;

		sanitizerUtilsSpy = {
			phoneNumber: jest
				.spyOn(SanitizerUtils, "phoneNumber")
				.mockImplementation((input: string) => input.replace(/[\D]/g, "")),
		};
	});

	afterEach(() => {
		sanitizerUtilsSpy.phoneNumber.mockRestore();

		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(authService).toBeDefined();
		expect(usersService).toBeDefined();
		expect(jwtService).toBeDefined();
		expect(bcryptAdapter).toBeDefined();
		expect(termsOfUseService).toBeDefined();

		expect(sanitizerUtilsSpy.phoneNumber).toBeDefined();
	});

	describe("register", () => {
		it("should successfully register a user and return SafeUserWithJwt", async () => {
			const { registerDto, fakeUser } = makeUser();
			const fakeTerms = makeTermsOfUse("fake-terms-id", "1.0", "Fake Content");
			const fakeAccessToken = "fake-jwt-token";
			const fakeAcceptance = makeUserTermsAcceptance(
				fakeUser.id,
				fakeTerms.id,
				fakeTerms.version,
			);

			usersService.validateUserUniqueness.mockResolvedValue(undefined);

			termsOfUseService.findActive.mockResolvedValue(fakeTerms);

			termsOfUseService.findById.mockResolvedValue(fakeTerms);

			bcryptAdapter.hash.mockResolvedValue("hashed_password");
			usersService.createUser.mockResolvedValue(fakeUser as User);
			termsOfUseService.acceptTerms.mockResolvedValue(fakeAcceptance);
			jwtService.sign.mockReturnValue(fakeAccessToken);

			const result = await authService.register(registerDto);

			expect(usersService.findByEmail).toHaveBeenCalledWith(
				registerDto.email,
				false,
			);
			expect(usersService.validateUserUniqueness).toHaveBeenCalledWith({
				email: registerDto.email,

				phone: registerDto.phone,
			});

			expect(sanitizerUtilsSpy.phoneNumber).toHaveBeenCalledWith(
				registerDto.phone,
			);
			expect(termsOfUseService.findActive).toHaveBeenCalled();

			expect(termsOfUseService.findById).toHaveBeenCalledWith(fakeTerms.id);
			expect(bcryptAdapter.hash).toHaveBeenCalledWith(registerDto.password);

			expect(usersService.createUser).toHaveBeenCalledWith({
				...registerDto,
				password: "hashed_password",

				phone: SanitizerUtils.phoneNumber(registerDto.phone),
			} as RegisterDto);

			expect(termsOfUseService.acceptTerms).toHaveBeenCalledWith({
				termsOfUseId: fakeTerms.id,
				userId: fakeUser.id,
			});

			expect(jwtService.sign).toHaveBeenCalledWith({
				id: fakeUser.id,
				email: fakeUser.email,
			});

			const expectedSafeUser: Omit<User, "password"> = (({
				password,
				...rest
			}) => rest)(fakeUser);

			expect(result).toEqual({
				...expectedSafeUser,
				access_token: fakeAccessToken,
			});
		});

		it("should throw BadRequestException if user uniqueness validation fails", async () => {
			const { registerDto } = makeUser();
			const validationError = new BadRequestException("Duplicate user data");

			usersService.validateUserUniqueness.mockRejectedValue(validationError);

			await expect(authService.register(registerDto)).rejects.toThrow(
				BadRequestException,
			);

			expect(usersService.findByEmail).toHaveBeenCalledWith(
				registerDto.email,
				false,
			);
			expect(usersService.validateUserUniqueness).toHaveBeenCalledWith({
				email: registerDto.email,

				phone: registerDto.phone,
			});

			expect(termsOfUseService.findActive).not.toHaveBeenCalled();
			expect(termsOfUseService.findById).not.toHaveBeenCalled();
			expect(bcryptAdapter.hash).not.toHaveBeenCalled();
			expect(usersService.createUser).not.toHaveBeenCalled();
			expect(termsOfUseService.acceptTerms).not.toHaveBeenCalled();
			expect(jwtService.sign).not.toHaveBeenCalled();
		});

		it("should throw BadRequestException if accept_terms is false", async () => {
			const { registerDto } = makeUser();
			const dtoWithTermsFalse: RegisterDto = {
				...registerDto,
				accept_terms: false,
			};

			usersService.validateUserUniqueness.mockResolvedValue(undefined);

			await expect(authService.register(dtoWithTermsFalse)).rejects.toThrow(
				new BadRequestException(
					errorMessages[ErrorCode.MISSING_ACCEPT_TERMS]["pt-BR"],
				),
			);

			expect(usersService.findByEmail).toHaveBeenCalledWith(
				dtoWithTermsFalse.email,
				false,
			);
			expect(usersService.validateUserUniqueness).toHaveBeenCalledWith({
				email: dtoWithTermsFalse.email,

				phone: dtoWithTermsFalse.phone,
			});

			expect(termsOfUseService.findActive).not.toHaveBeenCalled();
			expect(termsOfUseService.findById).not.toHaveBeenCalled();
			expect(bcryptAdapter.hash).not.toHaveBeenCalled();
			expect(usersService.createUser).not.toHaveBeenCalled();
			expect(termsOfUseService.acceptTerms).not.toHaveBeenCalled();
			expect(jwtService.sign).not.toHaveBeenCalled();
		});

		it("should throw an error if no active terms of use are found", async () => {
			const { registerDto } = makeUser();
			const errorFindingTerms = new NotFoundException("No active terms found");

			usersService.validateUserUniqueness.mockResolvedValue(undefined);
			termsOfUseService.findActive.mockRejectedValue(errorFindingTerms);

			await expect(authService.register(registerDto)).rejects.toThrow(
				errorFindingTerms,
			);

			expect(usersService.findByEmail).toHaveBeenCalledWith(
				registerDto.email,
				false,
			);
			expect(usersService.validateUserUniqueness).toHaveBeenCalledWith({
				email: registerDto.email,

				phone: registerDto.phone,
			});

			expect(termsOfUseService.findActive).toHaveBeenCalled();

			expect(termsOfUseService.findById).not.toHaveBeenCalled();
			expect(bcryptAdapter.hash).not.toHaveBeenCalled();
			expect(usersService.createUser).not.toHaveBeenCalled();
			expect(termsOfUseService.acceptTerms).not.toHaveBeenCalled();
			expect(jwtService.sign).not.toHaveBeenCalled();
		});
	});

	describe("login", () => {
		it("should successfully login a user and return AccessToken", async () => {
			const loginDto: LoginDto = {
				email: "test@example.com",
				password: "correct_password",
			};
			const fakeUser: User = {
				...makeUser().fakeUser,
				email: loginDto.email,
				password: "hashed_password_from_db",
			};
			const fakeAccessToken = "fake-login-jwt-token";

			usersService.findByEmail.mockResolvedValue(fakeUser);

			bcryptAdapter.compare.mockResolvedValue(true);

			jwtService.sign.mockReturnValue(fakeAccessToken);

			const result = await authService.login(loginDto);

			expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);

			expect(bcryptAdapter.compare).toHaveBeenCalledWith(
				loginDto.password,
				fakeUser.password,
			);

			expect(jwtService.sign).toHaveBeenCalledWith({
				id: fakeUser.id,
				email: fakeUser.email,
			});

			expect(result).toEqual({ access_token: fakeAccessToken });

			expect(usersService.validateUserUniqueness).not.toHaveBeenCalled();
			expect(usersService.createUser).not.toHaveBeenCalled();
			expect(termsOfUseService.findActive).not.toHaveBeenCalled();
			expect(termsOfUseService.findById).not.toHaveBeenCalled();
			expect(termsOfUseService.acceptTerms).not.toHaveBeenCalled();
		});

		it("should throw UnauthorizedException if user is not found", async () => {
			const loginDto: LoginDto = {
				email: "nonexistent@example.com",
				password: "any_password",
			};

			await expect(authService.login(loginDto)).rejects.toThrow(
				new UnauthorizedException(
					errorMessages[ErrorCode.LOGIN_FAILED]["pt-BR"],
				),
			);
			await expect(authService.login(loginDto)).rejects.toThrow(
				errorMessages[ErrorCode.LOGIN_FAILED]["pt-BR"],
			);

			expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);

			expect(bcryptAdapter.compare).not.toHaveBeenCalled();
			expect(jwtService.sign).not.toHaveBeenCalled();
			expect(termsOfUseService.findById).not.toHaveBeenCalled();
		});

		it("should throw UnauthorizedException if password is invalid", async () => {
			const loginDto: LoginDto = {
				email: "test@example.com",
				password: "incorrect_password",
			};
			const fakeUser: User = {
				...makeUser().fakeUser,
				email: loginDto.email,
				password: "hashed_password_from_db",
			};

			usersService.findByEmail.mockResolvedValue(fakeUser);
			bcryptAdapter.compare.mockResolvedValue(false);

			await expect(authService.login(loginDto)).rejects.toThrow(
				new UnauthorizedException(
					errorMessages[ErrorCode.LOGIN_FAILED]["pt-BR"],
				),
			);
			await expect(authService.login(loginDto)).rejects.toThrow(
				errorMessages[ErrorCode.LOGIN_FAILED]["pt-BR"],
			);

			expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
			expect(bcryptAdapter.compare).toHaveBeenCalledWith(
				loginDto.password,
				fakeUser.password,
			);

			expect(jwtService.sign).not.toHaveBeenCalled();
			expect(termsOfUseService.findById).not.toHaveBeenCalled();
		});

		it("should throw UnauthorizedException for any underlying error during login", async () => {
			const loginDto: LoginDto = {
				email: "test@example.com",
				password: "any_password",
			};
			const underlyingError = new Error("Some unexpected database error");

			usersService.findByEmail.mockRejectedValue(underlyingError);

			await expect(authService.login(loginDto)).rejects.toThrow(
				new UnauthorizedException(
					errorMessages[ErrorCode.LOGIN_FAILED]["pt-BR"],
				),
			);
			await expect(authService.login(loginDto)).rejects.toThrow(
				errorMessages[ErrorCode.LOGIN_FAILED]["pt-BR"],
			);

			expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);

			expect(bcryptAdapter.compare).not.toHaveBeenCalled();
			expect(jwtService.sign).not.toHaveBeenCalled();
			expect(termsOfUseService.findById).not.toHaveBeenCalled();
		});
	});

	describe("validateToken", () => {
		it("should return true for a valid token", async () => {
			const token = "a_valid_jwt_token";

			jwtService.verifyAsync.mockResolvedValue({});

			const result = await authService.validateToken(token);

			expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
			expect(result).toBe(true);
		});

		it("should return false for an invalid token", async () => {
			const token = "an_invalid_jwt_token";
			const verificationError = new Error("Invalid token signature");

			jwtService.verifyAsync.mockRejectedValue(verificationError);

			const result = await authService.validateToken(token);

			expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
			expect(result).toBe(false);
		});
	});

	describe("acceptTerms", () => {
		it("should successfully accept terms for a user", async () => {
			const { fakeUser } = makeUser();
			const userId = fakeUser.id;
			const termsId = "terms-id-456";
			const termsVersion = "1.0";
			const acceptTermsDto: AcceptTermsDto = { termsOfUseId: termsId };
			const fakeTerms = makeTermsOfUse(termsId, termsVersion);
			const fakeAcceptance = makeUserTermsAcceptance(
				userId,
				fakeTerms.id,
				fakeTerms.version,
			);

			termsOfUseService.findById.mockResolvedValue(fakeTerms);

			termsOfUseService.acceptTerms.mockResolvedValue(fakeAcceptance);

			const result = await authService.acceptTerms(acceptTermsDto, userId);

			expect(termsOfUseService.findById).toHaveBeenCalledWith(termsId);

			expect(termsOfUseService.acceptTerms).toHaveBeenCalledWith({
				termsOfUseId: termsId,
				userId: userId,
			});

			expect(result).toEqual(fakeAcceptance);
		});

		it("should throw an error if terms of use are not found during acceptance", async () => {
			const userId = "user-id-123";
			const termsId = "nonexistent-terms-id";
			const acceptTermsDto: AcceptTermsDto = { termsOfUseId: termsId };
			const notFoundError = new NotFoundException("Terms not found");

			termsOfUseService.findById.mockRejectedValue(notFoundError);

			await expect(
				authService.acceptTerms(acceptTermsDto, userId),
			).rejects.toThrow(notFoundError);

			expect(termsOfUseService.findById).toHaveBeenCalledWith(termsId);

			expect(termsOfUseService.acceptTerms).not.toHaveBeenCalled();
		});
	});
});
