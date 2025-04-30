import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { RegisterDto } from "src/auth/dto/register.dto";

const makeUser = () => {
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
	return { registerDto, fakeUser };
};

describe("UsersService", () => {
	let service: UsersService;
	let usersRepository: jest.Mocked<Repository<User>>;

	beforeEach(async () => {
		// antes de cada

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: getRepositoryToken(User),
					useValue: {
						create: jest.fn(),
						save: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
		usersRepository = module.get(getRepositoryToken(User));
	});

	it("should test logic of create new a user success", async () => {
		const { registerDto, fakeUser } = makeUser();

		usersRepository.create.mockReturnValue(fakeUser);
		usersRepository.save.mockResolvedValue(fakeUser);

		const result = await service.createUser(registerDto);

		expect(usersRepository.create).toHaveBeenCalled();
		expect(usersRepository.save).toHaveBeenCalled();
		expect(result).toEqual(fakeUser);
	});

	it("should call UserRepository.create with correct values", async () => {
		const { registerDto } = makeUser();

		await service.createUser(registerDto);

		expect(usersRepository.create).toHaveBeenCalledWith(registerDto);
	});

	it("should call UserRepository.save with correct values", async () => {
		const { registerDto, fakeUser } = makeUser();

		usersRepository.create.mockReturnValue(fakeUser);
		await service.createUser(registerDto);

		expect(usersRepository.save).toHaveBeenCalledWith(fakeUser);
	});
});
