import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { errorMessages } from "src/common/errors/errors-message";
import { SanitizerUtils } from "src/common/utils/sanitize";
import { makeUser } from "src/common/mock/test/mock-users.mock";
import { ValidateUniquenessDto } from "./dto/validateUniqueness.dto";

describe("UserService", () => {
	let service: UsersService;
	let usersRepository: jest.Mocked<Repository<User>>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: getRepositoryToken(User),
					useValue: {
						create: jest.fn(),
						save: jest.fn(),
						findOne: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
		usersRepository = module.get(getRepositoryToken(User));
	});

	describe("createUser", () => {
		it("should test logic of create new a user success", async () => {
			const { registerDto, fakeUser } = makeUser();

			usersRepository.create.mockReturnValue(fakeUser);
			usersRepository.save.mockResolvedValue(fakeUser);

			const result = await service.createUser(registerDto);

			expect(usersRepository.create).toHaveBeenCalledTimes(1);
			expect(usersRepository.save).toHaveBeenCalledTimes(1);
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

	describe("findByEmail", () => {
		it("should find a user by email successfully", async () => {
			const { fakeUser } = makeUser();
			usersRepository.findOne.mockResolvedValue(fakeUser);

			const result = await service.findByEmail(fakeUser.email);

			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { email: fakeUser.email },
			});
			expect(result).toEqual(fakeUser);
		});

		it("should throw NotFoundException if user is not found and throwNotFound is true", async () => {
			usersRepository.findOne.mockResolvedValue(null);

			await expect(
				service.findByEmail("nonexistent@teste.com", true),
			).rejects.toThrow(
				new NotFoundException(errorMessages.USER_NOT_FOUND["pt-BR"]),
			);

			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { email: "nonexistent@teste.com" },
			});
		});

		it("should return null if user is not found by email and argument throwNotFound be false", async () => {
			usersRepository.findOne.mockResolvedValue(null);

			const result = await service.findByEmail("nonexistent@teste.com", false);

			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { email: "nonexistent@teste.com" },
			});
			expect(result).toBeNull();
		});
	});

	describe("findById", () => {
		it("should find a user by id successfully", async () => {
			const { fakeUser } = makeUser();
			usersRepository.findOne.mockResolvedValue(fakeUser);

			const result = await service.findById(fakeUser.id);

			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { id: fakeUser.id },
			});
			expect(result).toEqual(fakeUser);
		});

		it("should return throw NotFoundException if user is not found by id", async () => {
			usersRepository.findOne.mockResolvedValue(null);

			await expect(service.findById("don't_exist")).rejects.toThrow(
				new NotFoundException(errorMessages.USER_NOT_FOUND["pt-BR"]),
			);

			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { id: "don't_exist" },
			});
		});
	});

	describe("validateUserUniqueness", () => {
		let phoneNumberSpy: jest.SpyInstance;

		beforeEach(() => {
			phoneNumberSpy = jest
				.spyOn(SanitizerUtils, "phoneNumber")
				.mockImplementation((input: string) => input.replace(/[\D]/g, ""));
		});

		afterEach(() => {
			phoneNumberSpy.mockRestore();
		});

		it("should complete successfully if no user is found with the same email or phone", async () => {
			const { registerDto } = makeUser();

			const validateData: ValidateUniquenessDto = {
				email: registerDto.email,
				phone: registerDto.phone,
			};

			usersRepository.findOne
				.mockResolvedValueOnce(null)
				.mockResolvedValueOnce(null);

			await expect(
				service.validateUserUniqueness(validateData),
			).resolves.toBeUndefined();

			expect(usersRepository.findOne).toHaveBeenCalledTimes(2);

			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { email: validateData.email },
			});

			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { phone: SanitizerUtils.phoneNumber(validateData.phone) },
			});

			expect(SanitizerUtils.phoneNumber).toHaveBeenCalledWith(
				validateData.phone,
			);
		});

		it("should throw BadRequestException if a user is found with the same email", async () => {
			const { registerDto, fakeUser } = makeUser();

			const validateData: ValidateUniquenessDto = {
				email: registerDto.email,
				phone: registerDto.phone,
			};

			usersRepository.findOne
				.mockResolvedValueOnce(fakeUser)
				.mockResolvedValueOnce(null);

			await expect(
				service.validateUserUniqueness(validateData),
			).rejects.toThrow(
				new BadRequestException(errorMessages.EMAIL_ALREADY_EXISTS["pt-BR"]),
			);

			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { email: validateData.email },
			});

			expect(SanitizerUtils.phoneNumber).toHaveBeenCalledWith(
				validateData.phone,
			);

			expect(usersRepository.findOne).toHaveBeenCalledTimes(2);

			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { phone: SanitizerUtils.phoneNumber(validateData.phone) },
			});
		});

		it("should throw BadRequestException if a user is found with the same phone", async () => {
			const { registerDto, fakeUser } = makeUser();

			const validateData: ValidateUniquenessDto = {
				email: registerDto.email,
				phone: registerDto.phone,
			};

			usersRepository.findOne
				.mockResolvedValueOnce(null)
				.mockResolvedValueOnce(fakeUser);

			await expect(
				service.validateUserUniqueness(validateData),
			).rejects.toThrow(
				new BadRequestException(
					errorMessages.PHONE_NUMBER_ALREADY_EXISTS["pt-BR"],
				),
			);

			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { email: validateData.email },
			});

			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { phone: SanitizerUtils.phoneNumber(validateData.phone) },
			});

			expect(SanitizerUtils.phoneNumber).toHaveBeenCalledWith(
				validateData.phone,
			);

			expect(usersRepository.findOne).toHaveBeenCalledTimes(2);
		});
	});

	describe("findByPhone", () => {
		let phoneNumberSpy: jest.SpyInstance;

		beforeEach(() => {
			phoneNumberSpy = jest
				.spyOn(SanitizerUtils, "phoneNumber")
				.mockImplementation((input: string) => input.replace(/[\D]/g, ""));
		});

		afterEach(() => {
			phoneNumberSpy.mockRestore();
		});

		it("should find a user by phone successfully", async () => {
			const { fakeUser } = makeUser();
			const inputPhone = "(99) 99999-9999";

			const sanitizedPhone = inputPhone.replace(/[\D]/g, "");
			usersRepository.findOne.mockResolvedValue(fakeUser);

			const result = await service.findByPhone(inputPhone);

			expect(SanitizerUtils.phoneNumber).toHaveBeenCalledWith(inputPhone);
			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { phone: sanitizedPhone },
			});
			expect(result).toEqual(fakeUser);
		});

		it("should throw NotFoundException if user is not found and throwNotFound is true", async () => {
			const inputPhone = "(00) 00000-0000";
			const sanitizedPhone = inputPhone.replace(/[\D]/g, "");
			usersRepository.findOne.mockResolvedValue(null);

			await expect(service.findByPhone(inputPhone, true)).rejects.toThrow(
				new NotFoundException(errorMessages.USER_NOT_FOUND["pt-BR"]),
			);

			expect(SanitizerUtils.phoneNumber).toHaveBeenCalledWith(inputPhone);
			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { phone: sanitizedPhone },
			});
		});

		it("should throw NotFoundException if user is not found and throwNotFound is not declared", async () => {
			const inputPhone = "(00) 00000-0000";
			const sanitizedPhone = inputPhone.replace(/[\D]/g, "");
			usersRepository.findOne.mockResolvedValue(null);

			await expect(service.findByPhone(inputPhone)).rejects.toThrow(
				new NotFoundException(errorMessages.USER_NOT_FOUND["pt-BR"]),
			);

			expect(SanitizerUtils.phoneNumber).toHaveBeenCalledWith(inputPhone);
			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { phone: sanitizedPhone },
			});
		});

		it("should return null if user is not found and throwNotFound is false", async () => {
			const inputPhone = "(00) 00000-0000";
			const sanitizedPhone = inputPhone.replace(/[\D]/g, "");
			usersRepository.findOne.mockResolvedValue(null);

			const result = await service.findByPhone(inputPhone, false);

			expect(SanitizerUtils.phoneNumber).toHaveBeenCalledWith(inputPhone);
			expect(usersRepository.findOne).toHaveBeenCalledWith({
				where: { phone: sanitizedPhone },
			});
			expect(result).toBeNull();
		});
	});
});
