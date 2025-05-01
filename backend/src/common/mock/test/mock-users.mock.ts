import { RegisterDto } from "src/auth/dto/register.dto";
import { SafeUser } from "../../../auth/dto/safeUser.dto";
import { User } from "src/entities/user.entity";

// export type MockUsersServiceType = {
// 	findById: jest.Mock<Promise<SafeUser>, [string]>;
// };

// export const mockUsersService = (): MockUsersServiceType => ({
// 	findById: jest.fn(),
// });

// export const createExpectedSafeUser = (
// 	overrides?: Partial<SafeUser>,
// ): SafeUser => ({
// 	id: "some-user-id",
// 	email: "test@example.com",
// 	fullName: "Test User",
// 	created_at: new Date(),
// 	birthdate: new Date(), // Provide a default value for birthdate
// 	phone: "123-456-7890", // Provide a default value for phone
// 	cpfOrCnpj: "default-cpfOrCnpj-value", // Provide a default value for CPF
// 	...overrides,
// });

export const makeUser = () => {
	const registerDto: RegisterDto = {
		email: "teste@teste.com",
		password: "senhaSegura123",
		phone: "99999999999",
		cpfOrCnpj: "12345678900",
		fullName: "Teste da Silva",
		birthdate: new Date("1990-01-01"),
		accept_terms: true,
	};

	const fakeUser: User = {
		...registerDto,
		id: "fake-id",
		createdAt: new Date(),
		updatedAt: new Date(),
		created_at: new Date(),
		updated_at: new Date(),
		deleted_at: null,
	} as User;

	const safeUser: SafeUser = {
		...registerDto,
		id: "fake-id",
		createdAt: new Date(),
		updatedAt: new Date(),
		created_at: new Date(),
		updated_at: new Date(),
		deleted_at: null,
	} as SafeUser;
	return { registerDto, fakeUser };
};
