import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeckService } from "./deck.service";
import { UsersService } from "src/users/users.service";
import { PackageService } from "src/package/package.service";
import { Deck } from "src/entities/decks.entity";
import { User } from "src/entities/user.entity";
import { Package } from "src/entities/package.entity";
import { CreateDeckDto } from "./dto/create.dto";

import { ChangeDeckStatusDto } from "./dto/changeStatus.dto";
import { UpdateDeckDto } from "./dto/update.dto";
import { DeckStatus } from "./common/enums/deckStatus.enum";
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
	decks: [],
});

const makeMockDeck = (
	id = "deck-id",
	ownerId = "user-owner-id",
	packageId?: string,
	status: DeckStatus = DeckStatus.Active,
	title = "Deck Title",
	description = "Deck Description",
	createdAt = new Date(),
	updatedAt = new Date(),
): Deck => ({
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

const makeMockCreateDeckDto = (pkgId?: string): CreateDeckDto => ({
	title: "Test Deck Title",
	description: "Test Description",
	package: pkgId,
	owner: makeMockUser("mock-owner-id"),
	createdAt: new Date(),
	updatedAt: new Date(),
});

const makeMockChangeDeckStatusDto = (
	id = "deck-id",
	status: DeckStatus = DeckStatus.Paused,
): ChangeDeckStatusDto => ({
	id,
	status,
});

const makeMockUpdateDeckDto = (
	id = "deck-id",
	updateData: Partial<UpdateDeckDto> = {},
): UpdateDeckDto => ({
	id,
	...updateData,
});

describe("DeckService", () => {
	let service: DeckService;

	let deckRepository: jest.Mocked<Repository<Deck>>;

	let usersService: jest.Mocked<UsersService>;

	let packageService: jest.Mocked<PackageService>;

	let serviceFindByIdSpy: jest.SpyInstance;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DeckService,
				{
					provide: getRepositoryToken(Deck),
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

		service = module.get<DeckService>(DeckService);
		deckRepository = module.get(getRepositoryToken(Deck));
		usersService = module.get(UsersService);
		packageService = module.get(PackageService);

		serviceFindByIdSpy = jest.spyOn(service, "findById");

		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
		expect(deckRepository).toBeDefined();
		expect(usersService).toBeDefined();
		expect(packageService).toBeDefined();
		expect(serviceFindByIdSpy).toBeDefined();
	});

	describe("create", () => {
		it("should create a deck with an associated package successfully", async () => {
			const userId = "user-owner-id";
			const packageId = "existing-package-id";
			const createDto = makeMockCreateDeckDto(packageId);
			const owner = makeMockUser(userId);
			const packageEntity = makeMockPackage(packageId, userId);

			const createdDeck = makeMockDeck(
				"new-deck-id-temp",
				userId,
				undefined,
				undefined,
				createDto.title,
				createDto.description,
			);

			createdDeck.owner = owner;
			createdDeck.package = packageEntity;
			createdDeck.status = DeckStatus.Active;
			createdDeck.createdAt = expect.any(Date) as Date;

			const savedDeck = { ...createdDeck, id: "saved-deck-id" };

			usersService.findById.mockResolvedValue(owner);

			packageService.findById.mockResolvedValue(packageEntity as PackageDto);
			deckRepository.create.mockReturnValue(createdDeck);
			deckRepository.save.mockResolvedValue(savedDeck);

			const result = await service.create(userId, createDto);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(packageService.findById).toHaveBeenCalledWith(userId, packageId);
			expect(deckRepository.create).toHaveBeenCalledWith({
				title: createDto.title,
				description: createDto.description || "",
				package: packageEntity,
				owner: owner,
				status: DeckStatus.Active,
				createdAt: expect.any(Date),
			});
			expect(deckRepository.save).toHaveBeenCalledWith(createdDeck);

			expect(result).toEqual(savedDeck);
		});

		it("should create a deck without an associated package successfully", async () => {
			const userId = "user-owner-id";
			const createDto = makeMockCreateDeckDto(undefined);
			const owner = makeMockUser(userId);

			const createdDeck = makeMockDeck(
				"new-deck-id-temp",
				userId,
				undefined,
				undefined,
				createDto.title,
				createDto.description,
			);
			createdDeck.owner = owner;
			createdDeck.package = null;
			createdDeck.status = DeckStatus.Active;
			createdDeck.createdAt = expect.any(Date) as Date;

			const savedDeck = { ...createdDeck, id: "saved-deck-id" };

			usersService.findById.mockResolvedValue(owner);
			expect(packageService.findById).not.toHaveBeenCalled();
			deckRepository.create.mockReturnValue(createdDeck);
			deckRepository.save.mockResolvedValue(savedDeck);

			const result = await service.create(userId, createDto);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(packageService.findById).not.toHaveBeenCalled();
			expect(deckRepository.create).toHaveBeenCalledWith({
				title: createDto.title,
				description: createDto.description || "",
				package: null,
				owner: owner,
				status: DeckStatus.Active,
				createdAt: expect.any(Date),
			});
			expect(deckRepository.save).toHaveBeenCalledWith(createdDeck);
			expect(result).toEqual(savedDeck);
		});

		it("should throw NotFoundException if owner is not found", async () => {
			const userId = "nonexistent-user-id";
			const createDto = makeMockCreateDeckDto("package-123");
			const serviceError = new NotFoundException("User not found");

			usersService.findById.mockRejectedValue(serviceError);

			await expect(service.create(userId, createDto)).rejects.toThrow(
				serviceError,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(packageService.findById).not.toHaveBeenCalled();
			expect(deckRepository.create).not.toHaveBeenCalled();
			expect(deckRepository.save).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if package is not found for the user", async () => {
			const userId = "user-owner-id";
			const packageId = "nonexistent-package-id";
			const createDto = makeMockCreateDeckDto(packageId);
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
			expect(deckRepository.create).not.toHaveBeenCalled();
			expect(deckRepository.save).not.toHaveBeenCalled();
		});
	});

	describe("findAll", () => {
		it("should find all decks for a user", async () => {
			const userId = "user-owner-id";
			const owner = makeMockUser(userId);

			const expectedDecks = [
				makeMockDeck("id1", userId, "pkg1", DeckStatus.Active),
				makeMockDeck("id2", userId, undefined, DeckStatus.Paused),
			];

			usersService.findById.mockResolvedValue(owner);

			deckRepository.find.mockResolvedValue(expectedDecks);

			const result = await service.findAll(userId);

			expect(usersService.findById).toHaveBeenCalledWith(userId);

			expect(deckRepository.find).toHaveBeenCalledWith({
				where: { owner: { id: userId } },
			});

			expect(result).toEqual(expectedDecks);
		});

		it("should return an empty array if the user has no decks", async () => {
			const userId = "user-owner-id";
			const owner = makeMockUser(userId);
			const expectedDecks: Deck[] = [];

			usersService.findById.mockResolvedValue(owner);

			deckRepository.find.mockResolvedValue(expectedDecks);

			const result = await service.findAll(userId);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(deckRepository.find).toHaveBeenCalledWith({
				where: { owner: { id: userId } },
			});
			expect(result).toEqual(expectedDecks);
			expect(result).toHaveLength(0);
		});

		it("should throw NotFoundException if owner is not found", async () => {
			const userId = "nonexistent-user-id";
			const serviceError = new NotFoundException("User not found");

			usersService.findById.mockRejectedValue(serviceError);

			await expect(service.findAll(userId)).rejects.toThrow(serviceError);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(deckRepository.find).not.toHaveBeenCalled();
		});

		// NOTA: A verificação `if (!deck)` no seu service.findAll
		// está incorreta para arrays e NÃO lançará NotFoundException se o find retornar [].
		// Os testes acima refletem o comportamento CORRETO de find (retornar array vazio).
		// **Remova a verificação `if (!deck)` do seu método service.findAll.**
	});

	describe("findById", () => {
		it("should find a deck by id for the given user", async () => {
			const userId = "user-owner-id";
			const deckId = "deck-to-find-id";
			const owner = makeMockUser(userId);
			const expectedDeck = makeMockDeck(deckId, userId);

			usersService.findById.mockResolvedValue(owner);

			deckRepository.findOne.mockResolvedValue(expectedDeck);

			const result = await service.findById(userId, deckId);

			expect(usersService.findById).toHaveBeenCalledWith(userId);

			expect(deckRepository.findOne).toHaveBeenCalledWith({
				where: { id: deckId, owner: { id: userId } },
			});

			expect(result).toEqual(expectedDeck);
		});

		it("should throw NotFoundException if owner is not found", async () => {
			const userId = "nonexistent-user-id";
			const deckId = "deck-to-find-id";
			const serviceError = new NotFoundException("User not found");

			usersService.findById.mockRejectedValue(serviceError);

			await expect(service.findById(userId, deckId)).rejects.toThrow(
				serviceError,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(deckRepository.findOne).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if deck is not found for the user id", async () => {
			const userId = "user-owner-id";
			const deckId = "nonexistent-deck-id-for-this-user";
			const owner = makeMockUser(userId);

			usersService.findById.mockResolvedValue(owner);
			deckRepository.findOne.mockResolvedValue(null);

			await expect(service.findById(userId, deckId)).rejects.toThrow(
				new NotFoundException(errorMessages.DECK_NOT_FOUND["pt-BR"]),
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(deckRepository.findOne).toHaveBeenCalledWith({
				where: { id: deckId, owner: { id: userId } },
			});
		});

		// NOTA: O cenário de "deck encontrado, mas pertence a owner diferente"
		// é IMPLICITAMENTE tratado pela sua implementação findById usando o filtro where: { id, owner: { id: userId } }.
		// Se o deck existe com outro owner, deckRepository.findOne com o ownerId CORRETO retornará null,
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

		it("should change deck status successfully", async () => {
			const userId = "user-owner-id";

			const changeStatusDto = makeMockChangeDeckStatusDto(
				"deck-id-to-change",
				DeckStatus.Paused,
			);
			const owner = makeMockUser(userId);

			const existingDeck = makeMockDeck(
				changeStatusDto.id,
				userId,
				"pkg1",
				DeckStatus.Active,
			);

			const expectedDeck = {
				...existingDeck,
				status: DeckStatus.Paused,
			};

			usersService.findById.mockResolvedValue(owner);

			serviceFindByIdSpy.mockResolvedValue(existingDeck);

			deckRepository.save.mockResolvedValue(expectedDeck);

			const result = await service.changeStatus(userId, changeStatusDto);

			expect(usersService.findById).toHaveBeenCalledWith(userId);

			expect(serviceFindByIdSpy).toHaveBeenCalledWith(
				userId,
				changeStatusDto.id,
			);

			expect(deckRepository.save).toHaveBeenCalledWith({
				...existingDeck,
				status: changeStatusDto.status,
			});

			expect(result).toEqual(expectedDeck);
		});

		it("should throw NotFoundException if owner user is not found when changing status", async () => {
			const userId = "nonexistent-user-id";
			const changeStatusDto = makeMockChangeDeckStatusDto(
				"deck-id-to-change",
				DeckStatus.Concluded,
			);
			const serviceError = new NotFoundException("User not found");

			usersService.findById.mockRejectedValue(serviceError);

			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(deckRepository.save).not.toHaveBeenCalled();

			await expect(
				service.changeStatus(userId, changeStatusDto),
			).rejects.toThrow(serviceError);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(deckRepository.save).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if deck is not found for the user when changing status", async () => {
			const userId = "user-owner-id";
			const changeStatusDto = makeMockChangeDeckStatusDto(
				"nonexistent-id",
				DeckStatus.Concluded,
			);
			const owner = makeMockUser(userId);

			const serviceError = new NotFoundException(
				"Deck not found for this user",
			);

			usersService.findById.mockResolvedValue(owner);

			serviceFindByIdSpy.mockRejectedValue(serviceError);

			expect(deckRepository.save).not.toHaveBeenCalled();

			await expect(
				service.changeStatus(userId, changeStatusDto),
			).rejects.toThrow(serviceError);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(
				userId,
				changeStatusDto.id,
			);
			expect(deckRepository.save).not.toHaveBeenCalled();
		});

		it("should throw BadRequestException if the status is already the target status", async () => {
			const userId = "user-owner-id";

			const changeStatusDto = makeMockChangeDeckStatusDto(
				"deck-id-to-change",
				DeckStatus.Active,
			);
			const owner = makeMockUser(userId);

			const existingDeck = makeMockDeck(
				changeStatusDto.id,
				userId,
				"pkg1",
				DeckStatus.Active,
			);

			usersService.findById.mockResolvedValue(owner);

			serviceFindByIdSpy.mockResolvedValue(existingDeck);

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
			expect(deckRepository.save).not.toHaveBeenCalled();
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

		it("should update a deck successfully", async () => {
			const userId = "user-owner-id";

			const updateDto = makeMockUpdateDeckDto("deck-id-to-update", {
				title: "New Title",
				description: "New Desc",
			});
			const owner = makeMockUser(userId);

			const existingDeck = makeMockDeck(
				updateDto.id,
				userId,
				"pkg1",
				DeckStatus.Active,
				"Old Title",
				"Old Desc",
			);

			const expectedDeck = {
				...existingDeck,
				title: updateDto.title || existingDeck.title,
				description: updateDto.description || existingDeck.description,
				updatedAt: expect.any(Date) as Date,
			};

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockResolvedValue(existingDeck);

			deckRepository.save.mockResolvedValue(expectedDeck);

			const result = await service.update(userId, updateDto);

			expect(usersService.findById).toHaveBeenCalledWith(userId);

			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, updateDto.id);

			expect(deckRepository.save).toHaveBeenCalledWith({
				...existingDeck,
				title: updateDto.title || existingDeck.title,
				description: updateDto.description || existingDeck.description,

				status: existingDeck.status,
				updatedAt: expect.any(Date),
			});

			expect(result).toEqual(expectedDeck);
		});

		it("should update only specified fields (e.g., title)", async () => {
			const userId = "user-owner-id";

			const updateDto = makeMockUpdateDeckDto("deck-id-to-update", {
				title: "Only Title Changed",
			});
			const owner = makeMockUser(userId);
			const existingDeck = makeMockDeck(
				updateDto.id,
				userId,
				"pkg1",
				DeckStatus.Active,
				"Old Title",
				"Old Desc",
			);

			const expectedDeck = {
				...existingDeck,
				title: updateDto.title || existingDeck.title,
				updatedAt: expect.any(Date) as Date,
			};

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockResolvedValue(existingDeck);
			deckRepository.save.mockResolvedValue(expectedDeck);

			const result = await service.update(userId, updateDto);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, updateDto.id);
			expect(deckRepository.save).toHaveBeenCalledWith({
				...existingDeck,
				title: updateDto.title || existingDeck.title,
				description: existingDeck.description,
				status: existingDeck.status,
				updatedAt: expect.any(Date),
			});
			expect(result).toEqual(expectedDeck);
		});

		it("should throw NotFoundException if owner user is not found when updating", async () => {
			const userId = "nonexistent-user-id";
			const updateDto = makeMockUpdateDeckDto("deck-id", {
				title: "Update",
			});
			const serviceError = new NotFoundException("User not found");

			usersService.findById.mockRejectedValue(serviceError);

			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(deckRepository.save).not.toHaveBeenCalled();

			await expect(service.update(userId, updateDto)).rejects.toThrow(
				serviceError,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(deckRepository.save).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if deck is not found for the user when updating", async () => {
			const userId = "user-owner-id";
			const updateDto = makeMockUpdateDeckDto("nonexistent-id", {
				title: "Update",
			});
			const owner = makeMockUser(userId);

			const serviceError = new NotFoundException(
				"Deck not found for this user",
			);

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockRejectedValue(serviceError);
			expect(deckRepository.save).not.toHaveBeenCalled();

			await expect(service.update(userId, updateDto)).rejects.toThrow(
				serviceError,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, updateDto.id);
			expect(deckRepository.save).not.toHaveBeenCalled();
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

		it("should delete a deck successfully", async () => {
			const userId = "user-owner-id";
			const deckId = "deck-to-delete-id";
			const owner = makeMockUser(userId);

			const deckToDelete = makeMockDeck(deckId, userId);

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockResolvedValue(deckToDelete);

			deckRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

			const result = await service.delete(userId, deckId);

			expect(usersService.findById).toHaveBeenCalledWith(userId);

			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, deckId);

			expect(deckRepository.delete).toHaveBeenCalledWith(deckId);

			expect(result).toEqual(deckToDelete);
		});

		it("should throw NotFoundException if owner user is not found when deleting", async () => {
			const userId = "nonexistent-user-id";
			const deckId = "deck-id";
			const serviceError = new NotFoundException("User not found");

			usersService.findById.mockRejectedValue(serviceError);

			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(deckRepository.delete).not.toHaveBeenCalled();

			await expect(service.delete(userId, deckId)).rejects.toThrow(
				serviceError,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(deckRepository.delete).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if deck is not found for the user when deleting", async () => {
			const userId = "user-owner-id";
			const deckId = "nonexistent-id";
			const owner = makeMockUser(userId);

			const serviceError = new NotFoundException(
				"Deck not found for this user",
			);

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockRejectedValue(serviceError);
			expect(deckRepository.delete).not.toHaveBeenCalled();

			await expect(service.delete(userId, deckId)).rejects.toThrow(
				serviceError,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, deckId);
			expect(deckRepository.delete).not.toHaveBeenCalled();
		});

		// NOTA: O cenário de "deck encontrado, mas owner diferente" resulta em NotFoundException propagada de service.findById.
		// Não há um teste UnauthorizedException separado aqui.
	});
});
