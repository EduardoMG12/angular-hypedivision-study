import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GroupDecks } from "../entities/group_decks.entity";
import { User } from "../entities/user.entity";

import { NotFoundException } from "@nestjs/common";
import { GroupDecksService } from "./group-decks.service";
import { UsersService } from "src/users/users.service";

import { CreateGroupDecksDto } from "./dto/create.dto";
import { ChangeGroupDecksStatusDto } from "./dto/change-status.dto";
import { UpdateGroupDecksDto } from "./dto/update.dto";
import { GroupDecksStatus } from "./common/enums/group-decksStatus.enum";

const makeMockUser = (id = "user-owner-id"): User => ({
	id,
	email: "owner@example.com",
	fullName: "GroupDeck Owner",
	password: "hashed_password",
	phone: "11999999999",
	birthdate: new Date("1990-01-01"),
	created_at: new Date(),
	updated_at: new Date(),
	deleted_at: null,
});

const makeMockGroupDeck = (
	id = "groupDeck-id",
	ownerId = "user-owner-id",

	status = GroupDecksStatus.Active,
	title = "Test GroupDeck",
	description = "This is a test groupDeck description.",
	createdAt = new Date(),
	updatedAt = new Date(),
): GroupDecks => ({
	id,
	title,
	description,
	owner: makeMockUser(ownerId),
	status,
	createdAt,
	updatedAt,
	decks: [],
});

describe("GroupDeckService", () => {
	let service: GroupDecksService;
	let groupDecksRepository: jest.Mocked<Repository<GroupDecks>>;
	let usersService: jest.Mocked<UsersService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GroupDecksService,

				{
					provide: getRepositoryToken(GroupDecks),
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
			],
		}).compile();

		service = module.get<GroupDecksService>(GroupDecksService);
		groupDecksRepository = module.get(getRepositoryToken(GroupDecks));
		usersService = module.get(UsersService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
		expect(groupDecksRepository).toBeDefined();
		expect(usersService).toBeDefined();
	});

	describe("create", () => {
		it("should create a groupDeck successfully", async () => {
			const userId = "user-owner-id";
			const createDto: CreateGroupDecksDto = {
				title: "New GroupDeck Title",
				description: "Details about the new groupDeck.",
			};
			const owner = makeMockUser(userId);
			const expectedGroupDeck = makeMockGroupDeck(
				"new-groupDeck-id",
				userId,
				GroupDecksStatus.Active,
				createDto.title,
				createDto.description,
			);

			usersService.findById.mockResolvedValue(owner);
			groupDecksRepository.create.mockReturnValue({
				...createDto,
				owner,
				status: GroupDecksStatus.Active,
				createdAt: new Date(),
			} as GroupDecks);
			groupDecksRepository.save.mockResolvedValue(expectedGroupDeck);

			const result = await service.create(userId, createDto);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(groupDecksRepository.create).toHaveBeenCalledWith({
				title: createDto.title,
				description: createDto.description,
				owner,
				status: GroupDecksStatus.Active,
				createdAt: expect.any(Date),
			});

			expect(groupDecksRepository.save).toHaveBeenCalledWith(
				groupDecksRepository.create.mock.results[0].value,
			);
			expect(result).toEqual(expectedGroupDeck);
		});

		it("should throw NotFoundException if owner is not found by UsersService", async () => {
			const userId = "nonexistent-user-id";
			const createDto: CreateGroupDecksDto = {
				title: "New GroupDeck Title",
				description: "Details about the new groupDeck.",
			};

			usersService.findById.mockRejectedValue(
				new NotFoundException("User not found"),
			);

			await expect(service.create(userId, createDto)).rejects.toThrow(
				NotFoundException,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(groupDecksRepository.create).not.toHaveBeenCalled();
			expect(groupDecksRepository.save).not.toHaveBeenCalled();
		});
	});

	describe("findAll", () => {
		it("should find all groupDecks for a user", async () => {
			const userId = "user-owner-id";
			const userGroupDecks = [
				makeMockGroupDeck("pkg1", userId),
				makeMockGroupDeck("pkg2", userId),
			];

			groupDecksRepository.find.mockResolvedValue(userGroupDecks);

			const result = await service.findAll(userId);

			expect(groupDecksRepository.find).toHaveBeenCalledWith({
				where: { owner: { id: userId } },
			});
			expect(result).toEqual(userGroupDecks);
		});

		it("should return an empty array if the user has no groupDecks", async () => {
			const userId = "user-without-groupDecks-id";
			const userGroupDecks: GroupDecks[] = [];

			groupDecksRepository.find.mockResolvedValue(userGroupDecks);

			const result = await service.findAll(userId);

			expect(groupDecksRepository.find).toHaveBeenCalledWith({
				where: { owner: { id: userId } },
			});
			expect(result).toEqual(userGroupDecks);
			expect(result).toHaveLength(0);
		});
	});

	describe("findById", () => {
		it("should find a groupDeck by id for the given user", async () => {
			const userId = "user-owner-id";
			const groupDeckId = "groupDeck-id";
			const owner = makeMockUser(userId);
			const expectedGroupDeck = makeMockGroupDeck(groupDeckId, userId);

			usersService.findById.mockResolvedValue(owner);
			groupDecksRepository.findOne.mockResolvedValue(expectedGroupDeck);

			const result = await service.findById(userId, groupDeckId);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(groupDecksRepository.findOne).toHaveBeenCalledWith({
				where: { owner: { id: userId }, id: groupDeckId },
			});
			expect(result).toEqual(expectedGroupDeck);
		});

		it("should throw NotFoundException if owner user is not found when finding groupDeck by id", async () => {
			const userId = "nonexistent-user-id";
			const groupDeckId = "groupDeck-id";

			usersService.findById.mockRejectedValue(
				new NotFoundException("User not found"),
			);
			expect(groupDecksRepository.findOne).not.toHaveBeenCalled();

			await expect(service.findById(userId, groupDeckId)).rejects.toThrow(
				NotFoundException,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(groupDecksRepository.findOne).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if groupDeck is not found for the given user id", async () => {
			const userId = "user-owner-id";
			const groupDeckId = "nonexistent-groupDeck-id-for-this-user";
			const owner = makeMockUser(userId);

			usersService.findById.mockResolvedValue(owner);
			groupDecksRepository.findOne.mockResolvedValue(null);

			await expect(service.findById(userId, groupDeckId)).rejects.toThrow(
				NotFoundException,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(groupDecksRepository.findOne).toHaveBeenCalledWith({
				where: { owner: { id: userId }, id: groupDeckId },
			});
		});
	});

	describe("changeStatus", () => {
		let serviceFindByIdSpy: jest.SpyInstance;

		beforeEach(() => {
			serviceFindByIdSpy = jest.spyOn(service, "findById");
		});

		afterEach(() => {
			serviceFindByIdSpy.mockRestore();
		});

		it("should change groupDeck status successfully", async () => {
			const userId = "user-owner-id";
			const changeStatusDto: ChangeGroupDecksStatusDto = {
				id: "groupDeck-id",
				status: GroupDecksStatus.Concluded,
			};
			const owner = makeMockUser(userId);
			const existingGroupDeck = makeMockGroupDeck(
				changeStatusDto.id,
				userId,
				GroupDecksStatus.Active,
			);
			const expectedGroupDeck = {
				...existingGroupDeck,
				status: changeStatusDto.status,
				updatedAt: expect.any(Date),
			};

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockResolvedValue(existingGroupDeck);
			groupDecksRepository.save.mockResolvedValue(
				expectedGroupDeck as GroupDecks,
			);

			const result = await service.changeStatus(userId, changeStatusDto);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(
				userId,
				changeStatusDto.id,
			);

			expect(groupDecksRepository.save).toHaveBeenCalledWith({
				...existingGroupDeck,
				status: changeStatusDto.status,
			});
			expect(result).toEqual(expectedGroupDeck);
		});

		it("should throw NotFoundException if owner user is not found when changing groupDeck status", async () => {
			const userId = "nonexistent-user-id";
			const changeStatusDto: ChangeGroupDecksStatusDto = {
				id: "groupDeck-id",
				status: GroupDecksStatus.Concluded,
			};

			usersService.findById.mockRejectedValue(
				new NotFoundException("User not found"),
			);
			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(groupDecksRepository.save).not.toHaveBeenCalled();

			await expect(
				service.changeStatus(userId, changeStatusDto),
			).rejects.toThrow(NotFoundException);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(groupDecksRepository.save).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if groupDeck is not found for the user when changing status", async () => {
			const userId = "user-owner-id";
			const changeStatusDto: ChangeGroupDecksStatusDto = {
				id: "nonexistent-id",
				status: GroupDecksStatus.Concluded,
			};
			const owner = makeMockUser(userId);

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockRejectedValue(
				new NotFoundException("GroupDeck not found"),
			);
			expect(groupDecksRepository.save).not.toHaveBeenCalled();

			await expect(
				service.changeStatus(userId, changeStatusDto),
			).rejects.toThrow(NotFoundException);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(
				userId,
				changeStatusDto.id,
			);
			expect(groupDecksRepository.save).not.toHaveBeenCalled();
		});
	});

	describe("update", () => {
		let serviceFindByIdSpy: jest.SpyInstance;

		beforeEach(() => {
			serviceFindByIdSpy = jest.spyOn(service, "findById");
		});

		afterEach(() => {
			serviceFindByIdSpy.mockRestore();
		});

		it("should update a groupDeck successfully", async () => {
			const userId = "user-owner-id";
			const updateDto: UpdateGroupDecksDto = {
				id: "groupDeck-to-update-id",
				title: "Updated Title",
				description: "Updated description.",
				status: GroupDecksStatus.Concluded,
			};
			const owner = makeMockUser(userId);
			const existingGroupDeck = makeMockGroupDeck(
				updateDto.id,
				userId,
				GroupDecksStatus.Active,
				"Old Title",
				"Old Description",
			);
			const expectedGroupDeck = {
				...existingGroupDeck,
				...updateDto,
				updatedAt: expect.any(Date),
			};

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockResolvedValue(existingGroupDeck);

			groupDecksRepository.save.mockResolvedValue(
				expectedGroupDeck as GroupDecks,
			);

			const result = await service.update(userId, updateDto);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, updateDto.id);
			expect(groupDecksRepository.save).toHaveBeenCalledWith({
				...existingGroupDeck,
				title: updateDto.title,
				description: updateDto.description,
				status: updateDto.status,
				updatedAt: expect.any(Date),
			});
			expect(result).toEqual(expectedGroupDeck);
		});

		it("should update only specified fields", async () => {
			const userId = "user-owner-id";
			const updateDto: UpdateGroupDecksDto = {
				id: "groupDeck-to-update-id",
				title: "Only Title Changed",
			};
			const owner = makeMockUser(userId);
			const existingGroupDeck = makeMockGroupDeck(
				updateDto.id,
				userId,
				GroupDecksStatus.Active,
				"Old Title",
				"Old Description",
			);
			const expectedGroupDeck = {
				...existingGroupDeck,
				title: updateDto.title,
				updatedAt: expect.any(Date),
			};

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockResolvedValue(existingGroupDeck);
			groupDecksRepository.save.mockResolvedValue(
				expectedGroupDeck as GroupDecks,
			);

			const result = await service.update(userId, updateDto);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, updateDto.id);
			expect(groupDecksRepository.save).toHaveBeenCalledWith({
				...existingGroupDeck,
				title: updateDto.title,

				updatedAt: expect.any(Date),
			});
			expect(result).toEqual(expectedGroupDeck);
		});

		it("should throw NotFoundException if owner user is not found when updating groupDeck", async () => {
			const userId = "nonexistent-user-id";
			const updateDto: UpdateGroupDecksDto = {
				id: "groupDeck-id",
				title: "Update",
			};

			usersService.findById.mockRejectedValue(
				new NotFoundException("User not found"),
			);
			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(groupDecksRepository.save).not.toHaveBeenCalled();

			await expect(service.update(userId, updateDto)).rejects.toThrow(
				NotFoundException,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(groupDecksRepository.save).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if groupDeck is not found for the user when updating", async () => {
			const userId = "user-owner-id";
			const updateDto: UpdateGroupDecksDto = {
				id: "nonexistent-id",
				title: "Update",
			};
			const owner = makeMockUser(userId);

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockRejectedValue(
				new NotFoundException("GroupDeck not found"),
			);
			expect(groupDecksRepository.save).not.toHaveBeenCalled();

			await expect(service.update(userId, updateDto)).rejects.toThrow(
				NotFoundException,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, updateDto.id);
			expect(groupDecksRepository.save).not.toHaveBeenCalled();
		});
	});

	describe("delete", () => {
		let serviceFindByIdSpy: jest.SpyInstance;

		beforeEach(() => {
			serviceFindByIdSpy = jest.spyOn(service, "findById");
		});

		afterEach(() => {
			serviceFindByIdSpy.mockRestore();
		});

		it("should delete a groupDeck successfully", async () => {
			const userId = "user-owner-id";
			const groupDeckId = "groupDeck-to-delete-id";
			const owner = makeMockUser(userId);
			const groupDeckToDelete = makeMockGroupDeck(groupDeckId, userId);

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockResolvedValue(groupDeckToDelete);
			groupDecksRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

			const result = await service.delete(userId, groupDeckId);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, groupDeckId);
			expect(groupDecksRepository.delete).toHaveBeenCalledWith(groupDeckId);

			expect(result).toEqual(groupDeckToDelete);
		});

		it("should throw NotFoundException if owner user is not found when deleting groupDeck", async () => {
			const userId = "nonexistent-user-id";
			const groupDeckId = "groupDeck-id";

			usersService.findById.mockRejectedValue(
				new NotFoundException("User not found"),
			);
			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(groupDecksRepository.delete).not.toHaveBeenCalled();

			await expect(service.delete(userId, groupDeckId)).rejects.toThrow(
				NotFoundException,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).not.toHaveBeenCalled();
			expect(groupDecksRepository.delete).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if groupDeck is not found for the user when deleting", async () => {
			const userId = "user-owner-id";
			const groupDeckId = "nonexistent-id";
			const owner = makeMockUser(userId);

			usersService.findById.mockResolvedValue(owner);
			serviceFindByIdSpy.mockRejectedValue(
				new NotFoundException("GroupDeck not found"),
			);
			expect(groupDecksRepository.delete).not.toHaveBeenCalled();

			await expect(service.delete(userId, groupDeckId)).rejects.toThrow(
				NotFoundException,
			);

			expect(usersService.findById).toHaveBeenCalledWith(userId);
			expect(serviceFindByIdSpy).toHaveBeenCalledWith(userId, groupDeckId);
			expect(groupDecksRepository.delete).not.toHaveBeenCalled();
		});
	});
});
