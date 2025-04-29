import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { RegisterDto } from "src/auth/dto/register.dto";
import { SafeUser } from "src/auth/dto/safeUser.dto";
import { NotFoundException } from "@nestjs/common";

describe("UsersService", () => {
	let service: UsersService;
	let mockUserRepository: {
		create: jest.Mock<SafeUser, [RegisterDto]>;
		save: jest.Mock<Promise<User>, [User]>;
		findOne: jest.Mock<
			Promise<SafeUser | null>,
			[{ where: { email: string } } | { where: { id: string } }]
		>;
	};

	beforeEach(async () => {
		mockUserRepository = {
			create: jest.fn().mockImplementation((dto) => dto),
			save: jest.fn().mockImplementation((user) => Promise.resolve(user)),
			findOne: jest.fn().mockImplementation(async (query) => {
				// Mock para findOne
				if (query.where.email === "testexample@example.com") {
					// Simula usuário encontrado por email
					return {
						id: "some-user-id",
						email: "testexample@example.com",
						fullName: "Example Test Of Silva",
						created_at: new Date(),
					} as SafeUser;
				}
				if (query.where.id === "some-user-id") {
					return {
						id: "some-user-id",
						email: "testexample@example.com",
						fullName: "Example Test Of Silva",

						created_at: new Date(),
					} as SafeUser;
				}
				return null;
			}),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: getRepositoryToken(User), // Use getRepositoryToken(User)
					useValue: mockUserRepository, // Mock do repositório (inicialmente vazio)
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("findByEmail", () => {
		it("should return a user when email is found", async () => {
			const emailToFind = "testexample@example.com";
			const expectedUser: SafeUser = {
				// Define o usuário esperado
				id: "some-user-id",
				email: "testexample@example.com",
				fullName: "Example Test Of Silva",
				birthdate: new Date("1990-01-01"), // Example birthdate
				phone: "1234567890", // Example phone number
				CPF: "123.456.789-00", // Example CPF
				created_at: new Date(),
			};

			const foundUser = await service.findByEmail(emailToFind); // Chama findByEmail

			expect(mockUserRepository.findOne).toHaveBeenCalledWith({
				where: { email: emailToFind },
			}); // Verifica se findOne foi chamado corretamente
			expect(foundUser).toEqual(expectedUser); // Verifica se o usuário retornado é o esperado
		});

		it("should throw NotFoundException when email is not found", async () => {
			const emailToFind = "nonexistent@example.com";

			await expect(service.findByEmail(emailToFind)).rejects.toThrowError(
				NotFoundException,
			);
			expect(mockUserRepository.findOne).toHaveBeenCalledWith({
				where: { email: emailToFind },
			});
		});
	});

	describe("findById", () => {
		it("should return a user when id is found", async () => {
			const idToFind = "some-user-id";
			const expectedUser = {
				// Define o usuário esperado
				id: "some-user-id",
				email: "testexample@example.com",
				fullName: "Example Test Of Silva",

				created_at: new Date(),
			};

			const foundUser = await service.findById(idToFind); // Chama findById

			expect(mockUserRepository.findOne).toHaveBeenCalledWith({
				where: { id: idToFind },
			}); // Verifica se findOne foi chamado corretamente
			expect(foundUser).toEqual(expectedUser); // Verifica se o usuário retornado é o esperado
		});

		it("should throw NotFoundException when id is not found", async () => {
			const idToFind = "nonexistent-user-id";

			// Espera que findById lance uma NotFoundException
			await expect(service.findById(idToFind)).rejects.toThrowError(
				NotFoundException,
			);
			expect(mockUserRepository.findOne).toHaveBeenCalledWith({
				where: { id: idToFind },
			}); // Verifica se findOne foi chamado corretamente
		});
	});

	describe("createUser", () => {
		it("should create a new user and return it", async () => {
			const registerDto: RegisterDto = {
				email: "testexample@example.com",
				fullName: "Example Test Of Silva",
				password: "testTestTest123",
				birthdate: new Date("1990-01-01"), // Example birthdate
				phone: "1234567890", // Example phone number
				CPF: "123.456.789-00", // Example CPF
			};

			const createdUser = await service.createUser(registerDto); // Chama o método createUser do serviço

			expect(mockUserRepository.create).toHaveBeenCalledWith(registerDto); // Verifica se usersRepository.create foi chamado corretamente
			expect(mockUserRepository.save).toHaveBeenCalledWith(registerDto); // Verifica se usersRepository.save foi chamado corretamente (com o DTO, pois create retorna o DTO no mock)
			expect(createdUser).toEqual(registerDto); // Verifica se createUser retorna o usuário criado (neste mock, retorna o DTO)
		});
	});
});
