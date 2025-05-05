import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FlashcardService } from "./flashcard.service";
import { UsersService } from "src/users/users.service";
import { PackageService } from "src/package/package.service";
import { Flashcard } from "src/entities/flashcards.entity";
import { User } from "src/entities/user.entity";
import { Package } from "src/entities/package.entity";
import { CreateFlashcardDto } from "./dto/create.dto";

import { ChangeFlashcardStatusDto } from "./dto/changeStatus.dto";
import { UpdateFlashcardDto } from "./dto/update.dto";
import { FlashcardStatus } from "./common/enums/flashcardStatus.enum";
import { PackageDto } from "src/package/dto/package.dto";

import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PackageStatus } from "src/package/common/enums/packageStatus.enum";
import { errorMessages } from "src/common/errors/errors-message";

const makeMockUser = (id = "user-owner-id"): User => ({
	id,
	email: "owner@example.com",
	fullName: "Package Owner",
	password: "hashed_password",
	birthdate: new Date("1990-01-01"),
	phone: "123-456-7890",

	created_at: new Date(),
	updated_at: new Date(),
	deleted_at: null,
});

const makeMockPackage = (
	id = "package-id",
	ownerId = "user-owner-id",
	status: PackageStatus = PackageStatus.Active,
	title = "Test Package",
	description = "This is a test package description.",
	createdAt = new Date(),
	updatedAt = new Date(),
): Package => ({
	id,
	title,
	description,
	owner: makeMockUser(ownerId),
	status,
	createdAt,
	updatedAt,
	flashcards: [],
});

const makeMockFlashcard = (
	id = "flashcard-id",
	ownerId = "user-owner-id",
	packageId?: string,
	status: FlashcardStatus = FlashcardStatus.Active,
	title = "Flashcard Title",
	description = "Flashcard Description",
	createdAt = new Date(),
	updatedAt = new Date(),
): Flashcard => ({
	id,
	title,
	description,

	owner: makeMockUser(ownerId),

	package: packageId ? makeMockPackage(packageId, ownerId) : null,
	status,
	createdAt,
	updatedAt,
	cards: [],
});

const makeMockCreateFlashcardDto = (pkgId?: string): CreateFlashcardDto => ({
	title: "Test Flashcard Title",
	description: "Test Description",
	package: pkgId,
	owner: makeMockUser("mock-owner-id"),
	createdAt: new Date(),
	updatedAt: new Date(),
});

const makeMockChangeFlashcardStatusDto = (
	id = "flashcard-id",
	status: FlashcardStatus = FlashcardStatus.Paused,
): ChangeFlashcardStatusDto => ({
	id,
	status,
});

const makeMockUpdateFlashcardDto = (
	id = "flashcard-id",
	updateData: Partial<UpdateFlashcardDto> = {},
): UpdateFlashcardDto => ({
	id,
	...updateData,
});

describe("FlashcardService", () => {
	let service: FlashcardService;

	let flashcardRepository: jest.Mocked<Repository<Flashcard>>;

	let usersService: jest.Mocked<UsersService>;

	let packageService: jest.Mocked<PackageService>;

	let serviceFindByIdSpy: jest.SpyInstance;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FlashcardService,
				{
					provide: getRepositoryToken(Flashcard),
					useValue: {
						create: jest.fn(),
						save: jest.fn(),
						findOne: jest.fn(),
						find: jest.fn(),
						delete: jest.fn(),
					},
				},
				{
					provide: UsersService,
					useValue: {
						findById: jest.fn(),
					},
				},
				{
					provide: PackageService,
					useValue: {
						findById: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get<FlashcardService>(FlashcardService);
		flashcardRepository = module.get(getRepositoryToken(Flashcard));
		usersService = module.get(UsersService);
		packageService = module.get(PackageService);

		serviceFindByIdSpy = jest.spyOn(service, "findById");

		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
		expect(flashcardRepository).toBeDefined();
		expect(usersService).toBeDefined();
		expect(packageService).toBeDefined();
		expect(serviceFindByIdSpy).toBeDefined();
	});

	describe("create", () => {
		it("should create a flashcard with an associated package successfully", async () => {
			const userId = "user-owner-id";
			const packageId = "existing-package-id";
			const createDto = makeMockCreateFlashcardDto(packageId);
			const owner = makeMockUser(userId);
			const packageEntity = makeMockPackage(packageId, userId);

			const createdFlashcard = makeMockFlashcard(
				"new-flashcard-id-temp",
				userId,
				undefined,
				undefined,
				createDto.title,
				createDto.description,
			);

			createdFlashcard.owner = owner;
			createdFlashcard.package = packageEntity;
			createdFlashcard.status = FlashcardStatus.Active;
			createdFlashcard.createdAt = expect.any(Date) as Date;

			const savedFlashcard = { ...createdFlashcard, id: "saved-flashcard-id" };

			usersService.findById.mockResolvedValue(owner);

			packageService.findById.mockResolvedValue(packageEntity as PackageDto);
			flashcardRepository.create.mockReturnValue(createdFlashcard);
			flashcardRepository.save.mockResolvedValue(savedFlashcard);

			const result = await service.create(userId, createDto);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(packageService.findById).toHaveBeenCalledWith(userId, packageId);
			expect(flashcardRepository.create).toHaveBeenCalledWith({
				title: createDto.title,
				description: createDto.description || "",
				package: packageEntity,
				owner: owner,
				status: FlashcardStatus.Active,
				createdAt: expect.any(Date),
			});
			expect(flashcardRepository.save).toHaveBeenCalledWith(createdFlashcard);

			expect(result).toEqual(savedFlashcard);
		});

		it("should create a flashcard without an associated package successfully", async () => {
			const userId = "user-owner-id";
			const createDto = makeMockCreateFlashcardDto(undefined);
			const owner = makeMockUser(userId);

			const createdFlashcard = makeMockFlashcard(
				"new-flashcard-id-temp",
				userId,
				undefined,
				undefined,
				createDto.title,
				createDto.description,
			);
			createdFlashcard.owner = owner;
			createdFlashcard.package = null;
			createdFlashcard.status = FlashcardStatus.Active;
			createdFlashcard.createdAt = expect.any(Date) as Date;

			const savedFlashcard = { ...createdFlashcard, id: "saved-flashcard-id" };

			usersService.findById.mockResolvedValue(owner);
			expect(packageService.findById).not.toHaveBeenCalled();
			flashcardRepository.create.mockReturnValue(createdFlashcard);
			flashcardRepository.save.mockResolvedValue(savedFlashcard);

			const result = await service.create(userId, createDto);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(packageService.findById).not.toHaveBeenCalled();
			expect(flashcardRepository.create).toHaveBeenCalledWith({
				title: createDto.title,
				description: createDto.description || "",
				package: null,
				owner: owner,
				status: FlashcardStatus.Active,
				createdAt: expect.any(Date),
			});
			expect(flashcardRepository.save).toHaveBeenCalledWith(createdFlashcard);
			expect(result).toEqual(savedFlashcard);
		});

		it("should throw NotFoundException if owner is not found", async () => {
			const userId = "nonexistent-user-id";
			const createDto = makeMockCreateFlashcardDto("package-123");
			const serviceError = new NotFoundException("User not found");

			usersService.findById.mockRejectedValue(serviceError);

			await expect(service.create(userId, createDto)).rejects.toThrow(
				serviceError,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(packageService.findById).not.toHaveBeenCalled();
			expect(flashcardRepository.create).not.toHaveBeenCalled();
			expect(flashcardRepository.save).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if package is not found for the user", async () => {
			const userId = "user-owner-id";
			const packageId = "nonexistent-package-id";
			const createDto = makeMockCreateFlashcardDto(packageId);
			const owner = makeMockUser(userId);

			const serviceError = new NotFoundException(
				"Package not found for this user",
			);

			usersService.findById.mockResolvedValue(owner);
			packageService.findById.mockRejectedValue(serviceError);

			await expect(service.create(userId, createDto)).rejects.toThrow(
				serviceError,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(packageService.findById).toHaveBeenCalledWith(userId, packageId);
			expect(flashcardRepository.create).not.toHaveBeenCalled();
			expect(flashcardRepository.save).not.toHaveBeenCalled();
		});
	});

	describe("findAll", () => {
		it("should find all flashcards for a user", async () => {
			const userId = "user-owner-id";
			const owner = makeMockUser(userId);

			const expectedFlashcards = [
				makeMockFlashcard("id1", userId, "pkg1", FlashcardStatus.Active),
				makeMockFlashcard("id2", userId, undefined, FlashcardStatus.Paused),
			];

			usersService.findById.mockResolvedValue(owner);

			flashcardRepository.find.mockResolvedValue(expectedFlashcards);

			const result = await service.findAll(userId);

			expect(usersService.findById).toHaveBeenCalledWith(userId);

			expect(flashcardRepository.find).toHaveBeenCalledWith({
				where: { owner: { id: userId } },
			});

			expect(result).toEqual(expectedFlashcards);
		});

		it("should return an empty array if the user has no flashcards", async () => {
			const userId = "user-owner-id";
			const owner = makeMockUser(userId);
			const expectedFlashcards: Flashcard[] = [];

			usersService.findById.mockResolvedValue(owner);

			flashcardRepository.find.mockResolvedValue(expectedFlashcards);

			const result = await service.findAll(userId);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(flashcardRepository.find).toHaveBeenCalledWith({
				where: { owner: { id: userId } },
			});
			expect(result).toEqual(expectedFlashcards);
			expect(result).toHaveLength(0);
		});

		it("should throw NotFoundException if owner is not found", async () => {
			const userId = "nonexistent-user-id";
			const serviceError = new NotFoundException("User not found");

			usersService.findById.mockRejectedValue(serviceError);

			await expect(service.findAll(userId)).rejects.toThrow(serviceError);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(flashcardRepository.find).not.toHaveBeenCalled();
		});

		// NOTA: A verificação `if (!flashcard)` no seu service.findAll
		// está incorreta para arrays e NÃO lançará NotFoundException se o find retornar [].
		// Os testes acima refletem o comportamento CORRETO de find (retornar array vazio).
		// **Remova a verificação `if (!flashcard)` do seu método service.findAll.**
	});

	describe("findById", () => {
		it("should find a flashcard by id for the given user", async () => {
			const userId = "user-owner-id";
			const flashcardId = "flashcard-to-find-id";
			const owner = makeMockUser(userId);
			const expectedFlashcard = makeMockFlashcard(flashcardId, userId);

			usersService.findById.mockResolvedValue(owner);

			flashcardRepository.findOne.mockResolvedValue(expectedFlashcard);

			const result = await service.findById(userId, flashcardId);

			expect(usersService.findById).toHaveBeenCalledWith(userId);

			expect(flashcardRepository.findOne).toHaveBeenCalledWith({
				where: { id: flashcardId, owner: { id: userId } },
			});

			expect(result).toEqual(expectedFlashcard);
		});

		it("should throw NotFoundException if owner is not found", async () => {
			const userId = "nonexistent-user-id";
			const flashcardId = "flashcard-to-find-id";
			const serviceError = new NotFoundException("User not found");

			usersService.findById.mockRejectedValue(serviceError);

			await expect(service.findById(userId, flashcardId)).rejects.toThrow(
				serviceError,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(flashcardRepository.findOne).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if flashcard is not found for the user id", async () => {
			const userId = "user-owner-id";
			const flashcardId = "nonexistent-flashcard-id-for-this-user";
			const owner = makeMockUser(userId);

			usersService.findById.mockResolvedValue(owner);
			flashcardRepository.findOne.mockResolvedValue(null);

			await expect(service.findById(userId, flashcardId)).rejects.toThrow(
				new NotFoundException(errorMessages.FLASHCARD_NOT_FOUND["pt-BR"]),
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(flashcardRepository.findOne).toHaveBeenCalledWith({
				where: { id: flashcardId, owner: { id: userId } },
			});
		});

		// NOTA: O cenário de "flashcard encontrado, mas pertence a owner diferente"
		// é IMPLICITAMENTE tratado pela sua implementação findById usando o filtro where: { id, owner: { id: userId } }.
		// Se o flashcard existe com outro owner, flashcardRepository.findOne com o ownerId CORRETO retornará null,
		// caindo no cenário acima (NotFoundException). Sua implementação NÃO lança UnauthorizedException aqui.
	});

	describe("changeStatus", () => {
		let serviceFindByIdSpy: jest.SpyInstance;

		beforeEach(() => {
			serviceFindByIdSpy = jest.spyOn(service, "findById");
			jest.clearAllMocks();
		});

		afterEach(() => {
			serviceFindByIdSpy.mockRestore();
		});

		it("should change flashcard status successfully", async () => {
			const userId = "user-owner-id";

			const changeStatusDto = makeMockChangeFlashcardStatusDto(
				"flashcard-id-to-change",
				FlashcardStatus.Paused,
			);
			const owner = makeMockUser(userId);

			const existingFlashcard = makeMockFlashcard(
				changeStatusDto.id,
				userId,
				"pkg1",
				FlashcardStatus.Active,
			);

			const expectedFlashcard = {
				...existingFlashcard,
				status: FlashcardStatus.Paused,
			};

			usersService.findById.mockResolvedValue(owner);

			serviceFindByIdSpy.mockResolvedValue(existingFlashcard);

			flashcardRepository.save.mockResolvedValue(expectedFlashcard);

			const result = await service.changeStatus(userId, changeStatusDto);

			expect(usersService.findById).toHaveBeenCalledWith(userId);

			expect(serviceFindByIdSpy).toHaveBeenCalledWith(
				userId,
				changeStatusDto.id,
			);

			expect(flashcardRepository.save).toHaveBeenCalledWith({
				...existingFlashcard,
				status: changeStatusDto.status,
			});

			expect(result).toEqual(expectedFlashcard);
		});

		it("should throw NotFoundException if owner user is not found when changing status", async () => {
			const userId = "nonexistent-user-id";
			const changeStatusDto = makeMockChangeFlashcardStatusDto(
				"flashcard-id-to-change",
				FlashcardStatus.Concluded,
			);
			const serviceError = new NotFoundException("User not found");

			usersService.findById.mockRejectedValue(serviceError);

			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(flashcardRepository.save).not.toHaveBeenCalled();

			await expect(
				service.changeStatus(userId, changeStatusDto),
			).rejects.toThrow(serviceError);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(flashcardRepository.save).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if flashcard is not found for the user when changing status", async () => {
			const userId = "user-owner-id";
			const changeStatusDto = makeMockChangeFlashcardStatusDto(
				"nonexistent-id",
				FlashcardStatus.Concluded,
			);
			const owner = makeMockUser(userId);

			const serviceError = new NotFoundException(
				"Flashcard not found for this user",
			);

			usersService.findById.mockResolvedValue(owner);

			serviceFindByIdSpy.mockRejectedValue(serviceError);

			expect(flashcardRepository.save).not.toHaveBeenCalled();

			await expect(
				service.changeStatus(userId, changeStatusDto),
			).rejects.toThrow(serviceError);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(
				userId,
				changeStatusDto.id,
			);
			expect(flashcardRepository.save).not.toHaveBeenCalled();
		});

		it("should throw BadRequestException if the status is already the target status", async () => {
			const userId = "user-owner-id";

			const changeStatusDto = makeMockChangeFlashcardStatusDto(
				"flashcard-id-to-change",
				FlashcardStatus.Active,
			);
			const owner = makeMockUser(userId);

			const existingFlashcard = makeMockFlashcard(
				changeStatusDto.id,
				userId,
				"pkg1",
				FlashcardStatus.Active,
			);

			usersService.findById.mockResolvedValue(owner);

			serviceFindByIdSpy.mockResolvedValue(existingFlashcard);

			await expect(
				service.changeStatus(userId, changeStatusDto),
			).rejects.toThrow(
				new BadRequestException("Cannot change status for egual status"),
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(
				userId,
				changeStatusDto.id,
			);
			expect(flashcardRepository.save).not.toHaveBeenCalled();
		});
	});

	describe("update", () => {
		let serviceFindByIdSpy: jest.SpyInstance;

		beforeEach(() => {
			serviceFindByIdSpy = jest.spyOn(service, "findById");
			jest.clearAllMocks();
		});

		afterEach(() => {
			serviceFindByIdSpy.mockRestore();
		});

		it("should update a flashcard successfully", async () => {
			const userId = "user-owner-id";

			const updateDto = makeMockUpdateFlashcardDto("flashcard-id-to-update", {
				title: "New Title",
				description: "New Desc",
			});
			const owner = makeMockUser(userId);

			const existingFlashcard = makeMockFlashcard(
				updateDto.id,
				userId,
				"pkg1",
				FlashcardStatus.Active,
				"Old Title",
				"Old Desc",
			);

			const expectedFlashcard = {
				...existingFlashcard,
				title: updateDto.title || existingFlashcard.title,
				description: updateDto.description || existingFlashcard.description,
				updatedAt: expect.any(Date) as Date,
			};

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockResolvedValue(existingFlashcard);

			flashcardRepository.save.mockResolvedValue(expectedFlashcard);

			const result = await service.update(userId, updateDto);

			expect(usersService.findById).toHaveBeenCalledWith(userId);

			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, updateDto.id);

			expect(flashcardRepository.save).toHaveBeenCalledWith({
				...existingFlashcard,
				title: updateDto.title || existingFlashcard.title,
				description: updateDto.description || existingFlashcard.description,

				status: existingFlashcard.status,
				updatedAt: expect.any(Date),
			});

			expect(result).toEqual(expectedFlashcard);
		});

		it("should update only specified fields (e.g., title)", async () => {
			const userId = "user-owner-id";

			const updateDto = makeMockUpdateFlashcardDto("flashcard-id-to-update", {
				title: "Only Title Changed",
			});
			const owner = makeMockUser(userId);
			const existingFlashcard = makeMockFlashcard(
				updateDto.id,
				userId,
				"pkg1",
				FlashcardStatus.Active,
				"Old Title",
				"Old Desc",
			);

			const expectedFlashcard = {
				...existingFlashcard,
				title: updateDto.title || existingFlashcard.title,
				updatedAt: expect.any(Date) as Date,
			};

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockResolvedValue(existingFlashcard);
			flashcardRepository.save.mockResolvedValue(expectedFlashcard);

			const result = await service.update(userId, updateDto);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, updateDto.id);
			expect(flashcardRepository.save).toHaveBeenCalledWith({
				...existingFlashcard,
				title: updateDto.title || existingFlashcard.title,
				description: existingFlashcard.description,
				status: existingFlashcard.status,
				updatedAt: expect.any(Date),
			});
			expect(result).toEqual(expectedFlashcard);
		});

		it("should throw NotFoundException if owner user is not found when updating", async () => {
			const userId = "nonexistent-user-id";
			const updateDto = makeMockUpdateFlashcardDto("flashcard-id", {
				title: "Update",
			});
			const serviceError = new NotFoundException("User not found");

			usersService.findById.mockRejectedValue(serviceError);

			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(flashcardRepository.save).not.toHaveBeenCalled();

			await expect(service.update(userId, updateDto)).rejects.toThrow(
				serviceError,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(flashcardRepository.save).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if flashcard is not found for the user when updating", async () => {
			const userId = "user-owner-id";
			const updateDto = makeMockUpdateFlashcardDto("nonexistent-id", {
				title: "Update",
			});
			const owner = makeMockUser(userId);

			const serviceError = new NotFoundException(
				"Flashcard not found for this user",
			);

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockRejectedValue(serviceError);
			expect(flashcardRepository.save).not.toHaveBeenCalled();

			await expect(service.update(userId, updateDto)).rejects.toThrow(
				serviceError,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, updateDto.id);
			expect(flashcardRepository.save).not.toHaveBeenCalled();
		});
	});

	describe("delete", () => {
		let serviceFindByIdSpy: jest.SpyInstance;

		beforeEach(() => {
			serviceFindByIdSpy = jest.spyOn(service, "findById");
			jest.clearAllMocks();
		});

		afterEach(() => {
			serviceFindByIdSpy.mockRestore();
		});

		it("should delete a flashcard successfully", async () => {
			const userId = "user-owner-id";
			const flashcardId = "flashcard-to-delete-id";
			const owner = makeMockUser(userId);

			const flashcardToDelete = makeMockFlashcard(flashcardId, userId);

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockResolvedValue(flashcardToDelete);

			flashcardRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

			const result = await service.delete(userId, flashcardId);

			expect(usersService.findById).toHaveBeenCalledWith(userId);

			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, flashcardId);

			expect(flashcardRepository.delete).toHaveBeenCalledWith(flashcardId);

			expect(result).toEqual(flashcardToDelete);
		});

		it("should throw NotFoundException if owner user is not found when deleting", async () => {
			const userId = "nonexistent-user-id";
			const flashcardId = "flashcard-id";
			const serviceError = new NotFoundException("User not found");

			usersService.findById.mockRejectedValue(serviceError);

			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(flashcardRepository.delete).not.toHaveBeenCalled();

			await expect(service.delete(userId, flashcardId)).rejects.toThrow(
				serviceError,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(flashcardRepository.delete).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if flashcard is not found for the user when deleting", async () => {
			const userId = "user-owner-id";
			const flashcardId = "nonexistent-id";
			const owner = makeMockUser(userId);

			const serviceError = new NotFoundException(
				"Flashcard not found for this user",
			);

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockRejectedValue(serviceError);
			expect(flashcardRepository.delete).not.toHaveBeenCalled();

			await expect(service.delete(userId, flashcardId)).rejects.toThrow(
				serviceError,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, flashcardId);
			expect(flashcardRepository.delete).not.toHaveBeenCalled();
		});

		// NOTA: O cenário de "flashcard encontrado, mas owner diferente" resulta em NotFoundException propagada de service.findById.
		// Não há um teste UnauthorizedException separado aqui.
	});
});
