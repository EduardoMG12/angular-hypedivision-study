import { SafeUser } from "../../../auth/dto/safeUser.dto";

export type MockUsersServiceType = {
	findById: jest.Mock<Promise<SafeUser>, [string]>;
};

export const mockUsersService = (): MockUsersServiceType => ({
	findById: jest.fn(),
});

export const createExpectedSafeUser = (
	overrides?: Partial<SafeUser>,
): SafeUser => ({
	id: "some-user-id",
	email: "test@example.com",
	fullName: "Test User",
	created_at: new Date(),
	birthdate: new Date(), // Provide a default value for birthdate
	phone: "123-456-7890", // Provide a default value for phone
	cpfOrCnpj: "default-cpfOrCnpj-value", // Provide a default value for CPF
	...overrides,
});
