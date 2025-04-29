// // import { SafeUser } from "../../../auth/dto/safeUser.dto";
// // import { AccessToken } from "../../../auth/dto/accessToken.dto";
// // import { RegisterDto } from "../../../auth/dto/register.dto";
// // import { LoginDto } from "../../../auth/dto/login.dto";

// // export type MockAuthServiceType = {
// // 	register: jest.Mock<Promise<SafeUser>, [RegisterDto]>;
// // 	login: jest.Mock<Promise<AccessToken>, [LoginDto]>;
// // };

// // export const mockAuthService = (): MockAuthServiceType => ({
// // 	register: jest.fn(),
// // 	login: jest.fn(),
// // });

// // export const createMockRegisterDto = (
// // 	overrides?: Partial<RegisterDto>,
// // ): RegisterDto => ({
// // 	email: "testexample@example.com",
// // 	fullName: "Example Test Of Silva",
// // 	password: "testTestTest123",
// // 	birthdate: new Date(), // Provide a default value for birthdate
// // 	phone: overrides?.phone ?? "default-phone", // Ensure phone is always a string
// // 	cpfOrCnpj: overrides?.cpfOrCnpj ?? "default-cpfOrCnpj", // Ensure cpfOrCnpj is always a string
// // 	accept_terms: overrides?.accept_terms ?? true,
// // 	...overrides,
// // });

// // export const createMockLoginDto = (
// // 	overrides?: Partial<LoginDto>,
// // ): LoginDto => ({
// // 	email: "testexample@example.com",
// // 	password: "testTestTest123",
// // 	...overrides,
// // });

// // export const createExpectedSafeUser = (
// // 	overrides?: Partial<SafeUser>,
// // ): SafeUser => ({
// // 	id: "some-user-id",
// // 	email: "testexample@example.com",
// // 	fullName: "Example Test Of Silva",
// // 	birthdate: overrides?.birthdate ?? new Date(), // Ensure birthdate is always a Date
// // 	phone: overrides?.phone ?? "default-phone", // Ensure phone is always a string
// // 	cpfOrCnpj: overrides?.cpfOrCnpj ?? "default-cpfOrCnpj", // Ensure cpfOrCnpj is always a string
// // 	created_at: new Date(),
// // 	...overrides,
// // });

// // export const createExpectedAccessToken = (
// // 	overrides?: Partial<AccessToken>,
// // ): AccessToken => ({
// // 	access_token: "mocked-access-token",
// // 	...overrides,
// // });
