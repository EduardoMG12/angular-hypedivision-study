import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { SafeUser } from "./dto/safeUser.dto";
import { AccessToken } from "./dto/accessToken.dto";
import { BcryptAdapter } from "../common/adapter/bcrypt.adapter";
import { BadRequestException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { User } from "../entities/user.entity";

describe("AuthService", () => {
	let service: AuthService;
	let mockUsersService: {
		createUser: jest.Mock<Promise<SafeUser>, [RegisterDto]>;
		findByEmail: jest.Mock<Promise<SafeUser | null>, [string]>;
	};
	let mockJwtService: {
		sign: jest.Mock<string, [AccessToken]>;
	};
	let mockBcrypt: {
		hash: jest.Mock<Promise<string>, [string]>;
		compare: jest.Mock<Promise<boolean>, [string, string]>;
	};

	beforeEach(async () => {
		mockUsersService = {
			createUser: jest.fn(),
			findByEmail: jest.fn(),
		};
		mockJwtService = {
			sign: jest.fn(),
		};
		mockBcrypt = {
			hash: jest.fn(),
			compare: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
				{
					provide: JwtService,
					useValue: mockJwtService,
				},
				{
					provide: BcryptAdapter,
					useValue: mockBcrypt,
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("register", () => {
		it("should register a new user and return SafeUser", async () => {
			const registerDto: RegisterDto = {
				email: "testexample@example.com",
				fullName: "Example Test Of Silva",
				password: "testTestTest123",
				birthdate: new Date("1990-12-17"),
				phone: "(99) 99999-9999",
				cpfOrCnpj: "123.456.789-00",
				accept_terms: true,
			};
			const hashedPassword = "hashedPasswordExample";
			const expectedSafeUser: SafeUser = {
				id: "some-user-id",
				email: registerDto.email,
				fullName: registerDto.fullName,
				created_at: new Date(),
				birthdate: registerDto.birthdate,
				phone: registerDto.phone,
				cpfOrCnpj: registerDto.cpfOrCnpj,
				client: null, // Add appropriate value for 'client' if needed
			};

			mockBcrypt.hash.mockResolvedValue(hashedPassword);
			mockUsersService.createUser.mockResolvedValue(expectedSafeUser);

			const result = await service.register(registerDto);

			expect(mockBcrypt.hash).toHaveBeenCalledWith(registerDto.password);
			expect(mockUsersService.createUser).toHaveBeenCalledWith({
				...registerDto,
				password: hashedPassword,
			});
			expect(result).toEqual(expectedSafeUser);
		});

		it("should login user and return AccessToken", async () => {
			const loginDto: LoginDto = {
				email: "testexample@example.com",
				password: "testTestTest123",
			};
			const mockUserFromService = {
				id: "some-user-id",
				email: loginDto.email,
				fullName: "Test User",
				created_at: new Date(),
				birthdate: new Date("1990-01-01"),
				cpfOrCnpj: "123.456.789-00",
				phone: "(99) 99999-9999",
				password: "hashedPasswordExample",
			} as User;
			const expectedAccessToken: AccessToken = {
				access_token: "mocked-access-token",
			};

			mockUsersService.findByEmail.mockResolvedValue(mockUserFromService);
			mockBcrypt.compare.mockResolvedValue(true);
			mockJwtService.sign.mockReturnValue(expectedAccessToken.access_token);

			const result = await service.login(loginDto);

			expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
			expect(mockBcrypt.compare).toHaveBeenCalledWith(
				loginDto.password,
				mockUserFromService.password,
			);
			expect(mockJwtService.sign).toHaveBeenCalledWith({
				id: mockUserFromService.id,
				email: mockUserFromService.email,
			});
			expect(result).toEqual(expectedAccessToken);
		});

		it("should throw BadRequestException if email already exists", async () => {
			const registerDto: RegisterDto = {
				email: "existing@example.com",
				fullName: "Existing User",
				password: "testTestTest123",
				birthdate: new Date("1990-01-01"),
				phone: "(99) 99999-9999",
				cpfOrCnpj: "123.456.789-00",
				accept_terms: true,
			};

			mockUsersService.findByEmail.mockResolvedValue({
				id: "some-user-id",
				email: registerDto.email,
				fullName: "Existing User",
				created_at: new Date(),
			} as SafeUser);

			await expect(service.register(registerDto)).rejects.toThrow(
				BadRequestException,
			);
		});
	});
});
