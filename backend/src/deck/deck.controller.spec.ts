import { Test, TestingModule } from "@nestjs/testing";
import { DeckController } from "./deck.controller";
import { DeckService } from "./deck.service";
import { CreateDeckDto } from "./dto/create.dto";
import { DeckDto } from "./dto/deck.dto";
import { ChangeDeckStatusDto } from "./dto/changeStatus.dto";
import { UpdateDeckDto } from "./dto/update.dto";
import {
	NotFoundException,
	BadRequestException,
	UnauthorizedException,
} from "@nestjs/common";
import { DeckStatus } from "./common/enums/deckStatus.enum";

let mockToPlainToInstance: jest.Mock;

jest.mock("./../common/utils/toPlainToInstance", () => ({
	toPlainToInstance: jest.fn(),
}));

import { toPlainToInstance } from "../common/utils/toPlainToInstance";
import { Package } from "src/entities/package.entity";

const makeMockCreateDeckDto = (pkgId?: string): CreateDeckDto => ({
	title: "Test Deck Title",
	description: "Test Description",
	package: pkgId,
	owner: { id: "test-owner-id", name: "Test User" } as any,
	createdAt: new Date(),
	updatedAt: new Date(),
});

const makeMockDeckDto = (
	id = "deck-id",
	pkgId?: string,
	userId = "user-id",
): DeckDto => ({
	id,
	title: "Test Deck Title",
	description: "Test Description",

	package: pkgId ? ({ id: pkgId } as Package) : null,
	owner: { id: userId } as any,
	status: "active" as any,
	createdAt: new Date(),
	updatedAt: new Date(),
});

const makeMockChangeDeckStatusDto = (
	id = "deck-id",
	status = "paused",
): ChangeDeckStatusDto => ({
	id,
	status: status as DeckStatus,
});

const makeMockUpdateDeckDto = (
	id = "deck-id",
	updateData: Partial<UpdateDeckDto> = {},
): UpdateDeckDto => ({
	id,
	...updateData,
});

describe("DeckController", () => {
	let controller: DeckController;

	let service: jest.Mocked<DeckService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [DeckController],
			providers: [
				{
					provide: DeckService,
					useValue: {
						create: jest.fn(),
						findAll: jest.fn(),
						findById: jest.fn(),
						changeStatus: jest.fn(),
						update: jest.fn(),
						delete: jest.fn(),
					},
				},
			],
		}).compile();

		controller = module.get<DeckController>(DeckController);
		service = module.get(DeckService) as jest.Mocked<DeckService>;

		mockToPlainToInstance =
			require("./../common/utils/toPlainToInstance").toPlainToInstance;

		jest.clearAllMocks();

		mockToPlainToInstance.mockImplementation((dtoClass: any, entity: any) => {
			return entity;
		});
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
		expect(service).toBeDefined();
		expect(mockToPlainToInstance).toBeDefined();
	});

	describe("create", () => {
		it("should call service.create with userId and DTO and return the transformed result", async () => {
			const userId = "test-user-id";
			const createDto = makeMockCreateDeckDto("package-123");
			const serviceResult = makeMockDeckDto(
				"new-deck-id",
				createDto.package,
				userId,
			);
			const transformedResult = makeMockDeckDto(
				"new-deck-id",
				createDto.package,
				userId,
			);

			service.create.mockResolvedValue(serviceResult);

			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await controller.create(userId, createDto);

			expect(service.create).toHaveBeenCalledWith(userId, createDto);

			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				DeckDto,
				serviceResult,
			);

			expect(result).toEqual(transformedResult);
		});

		it("should throw the exception thrown by service.create", async () => {
			const userId = "test-user-id";
			const createDto = makeMockCreateDeckDto("package-123");
			const serviceError = new BadRequestException(
				"Invalid deck data or package ID",
			);

			service.create.mockRejectedValue(serviceError);

			await expect(controller.create(userId, createDto)).rejects.toThrow(
				serviceError,
			);

			expect(service.create).toHaveBeenCalledWith(userId, createDto);

			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});

		it("should handle creation without a package ID", async () => {
			const userId = "test-user-id";
			const createDto = makeMockCreateDeckDto(undefined);
			const serviceResult = makeMockDeckDto("new-deck-id", undefined, userId);
			const transformedResult = makeMockDeckDto(
				"new-deck-id",
				undefined,
				userId,
			);

			service.create.mockResolvedValue(serviceResult);
			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await controller.create(userId, createDto);

			expect(service.create).toHaveBeenCalledWith(userId, createDto);
			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				DeckDto,
				serviceResult,
			);
			expect(result).toEqual(transformedResult);
		});
	});

	describe("findAll", () => {
		it("should call service.findAll with userId and return the transformed array result", async () => {
			const userId = "test-user-id";

			const serviceResult = [
				makeMockDeckDto("id1", "pkg1", userId),
				makeMockDeckDto("id2", "pkg1", userId),
			];

			const transformedResult = [
				makeMockDeckDto("id1", "pkg1", userId),
				makeMockDeckDto("id2", "pkg1", userId),
			];

			service.findAll.mockResolvedValue(serviceResult);

			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await controller.findAll(userId);

			expect(service.findAll).toHaveBeenCalledWith(userId);

			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				DeckDto,
				serviceResult,
			);

			expect(result).toEqual(transformedResult);
		});

		it("should return an empty array if service.findAll returns an empty array", async () => {
			const userId = "test-user-id";
			const serviceResult: DeckDto[] = [];
			const transformedResult: DeckDto[] = [];

			service.findAll.mockResolvedValue(serviceResult);
			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await controller.findAll(userId);

			expect(service.findAll).toHaveBeenCalledWith(userId);
			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				DeckDto,
				serviceResult,
			);
			expect(result).toEqual(transformedResult);
			expect(result).toHaveLength(0);
		});

		it("should throw the exception thrown by service.findAll", async () => {
			const userId = "test-user-id";
			const serviceError = new UnauthorizedException("User not authorized");

			service.findAll.mockRejectedValue(serviceError);

			await expect(controller.findAll(userId)).rejects.toThrow(serviceError);

			expect(service.findAll).toHaveBeenCalledWith(userId);
			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});
	});

	describe("findById", () => {
		// it("should call service.findById with userId and id and return the transformed result", async () => {
		// 	const userId = "test-user-id";
		// 	const deckId = "deck-to-find-id";

		// 	const requestBody = { id: deckId };
		// 	const serviceResult = makeMockDeckDto(deckId, "pkg1", userId);
		// 	const transformedResult = makeMockDeckDto(
		// 		deckId,
		// 		"pkg1",
		// 		userId,
		// 	);

		// 	service.findById.mockResolvedValue(serviceResult);
		// 	mockToPlainToInstance.mockReturnValue(transformedResult);

		// 	const result = await controller.findById(userId, requestBody);

		// 	expect(service.findById).toHaveBeenCalledWith(userId, deckId);

		// 	expect(mockToPlainToInstance).toHaveBeenCalledWith(
		// 		DeckDto,
		// 		serviceResult,
		// 	);

		// 	expect(result).toEqual(transformedResult);
		// });

		it("should throw NotFoundException if service.findById throws NotFoundException", async () => {
			const userId = "test-user-id";
			const deckId = "nonexistent-id";
			const requestBody = { id: deckId };
			const serviceError = new NotFoundException(
				"Deck not found for this user",
			);

			service.findById.mockRejectedValue(serviceError);

			await expect(controller.findById(userId, requestBody)).rejects.toThrow(
				serviceError,
			);

			expect(service.findById).toHaveBeenCalledWith(userId, deckId);
			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});

		it("should throw other exceptions thrown by service.findById", async () => {
			const userId = "test-user-id";
			const deckId = "some-id";
			const requestBody = { id: deckId };
			const serviceError = new BadRequestException("Invalid ID format");

			service.findById.mockRejectedValue(serviceError);

			await expect(controller.findById(userId, requestBody)).rejects.toThrow(
				serviceError,
			);

			expect(service.findById).toHaveBeenCalledWith(userId, deckId);
			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});
	});

	describe("changeStatus", () => {
		it("should call service.changeStatus with userId and DTO and return the transformed result", async () => {
			const userId = "test-user-id";
			const changeStatusDto = makeMockChangeDeckStatusDto(
				"deck-id-to-change",
				"concluded",
			);
			const serviceResult = makeMockDeckDto(changeStatusDto.id, "pkg1", userId);
			const transformedResult = makeMockDeckDto(
				changeStatusDto.id,
				"pkg1",
				userId,
			);

			transformedResult.status = changeStatusDto.status as any;

			service.changeStatus.mockResolvedValue(serviceResult);
			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await controller.changeStatus(userId, changeStatusDto);

			expect(service.changeStatus).toHaveBeenCalledWith(
				userId,
				changeStatusDto,
			);

			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				DeckDto,
				serviceResult,
			);

			expect(result).toEqual(transformedResult);
		});

		it("should throw exceptions thrown by service.changeStatus", async () => {
			const userId = "test-user-id";
			const changeStatusDto = makeMockChangeDeckStatusDto(
				"deck-id-to-change",
				"invalid-status",
			);
			const serviceError = new BadRequestException("Invalid status transition");

			service.changeStatus.mockRejectedValue(serviceError);

			await expect(
				controller.changeStatus(userId, changeStatusDto),
			).rejects.toThrow(serviceError);

			expect(service.changeStatus).toHaveBeenCalledWith(
				userId,
				changeStatusDto,
			);
			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if service.changeStatus throws NotFoundException", async () => {
			const userId = "test-user-id";
			const changeStatusDto = makeMockChangeDeckStatusDto(
				"nonexistent-id",
				"paused",
			);
			const serviceError = new NotFoundException(
				"Deck not found for this user",
			);

			service.changeStatus.mockRejectedValue(serviceError);

			await expect(
				controller.changeStatus(userId, changeStatusDto),
			).rejects.toThrow(serviceError);

			expect(service.changeStatus).toHaveBeenCalledWith(
				userId,
				changeStatusDto,
			);
			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});
	});

	describe("update", () => {
		it("should call service.update with userId and DTO and return the transformed result", async () => {
			const userId = "test-user-id";
			const updateDto = makeMockUpdateDeckDto("deck-id-to-update", {
				title: "New Title",
				description: "New Desc",
			});

			const serviceResult = makeMockDeckDto(updateDto.id, "pkg1", userId);

			serviceResult.title = updateDto.title ?? serviceResult.title;
			serviceResult.description =
				updateDto.description ?? serviceResult.description;

			const transformedResult = makeMockDeckDto(updateDto.id, "pkg1", userId);

			transformedResult.title = updateDto.title ?? transformedResult.title;
			transformedResult.description =
				updateDto.description ?? transformedResult.description;

			service.update.mockResolvedValue(serviceResult);
			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await controller.update(userId, updateDto);

			expect(service.update).toHaveBeenCalledWith(userId, updateDto);

			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				DeckDto,
				serviceResult,
			);

			expect(result).toEqual(transformedResult);
		});

		it("should throw exceptions thrown by service.update", async () => {
			const userId = "test-user-id";
			const updateDto = makeMockUpdateDeckDto("deck-id-to-update", {
				title: "",
			});
			const serviceError = new BadRequestException("Invalid title or data");

			service.update.mockRejectedValue(serviceError);

			await expect(controller.update(userId, updateDto)).rejects.toThrow(
				serviceError,
			);

			expect(service.update).toHaveBeenCalledWith(userId, updateDto);
			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if service.update throws NotFoundException", async () => {
			const userId = "test-user-id";
			const updateDto = makeMockUpdateDeckDto("nonexistent-id", {
				title: "Update",
			});
			const serviceError = new NotFoundException(
				"Deck not found for this user",
			);

			service.update.mockRejectedValue(serviceError);

			await expect(controller.update(userId, updateDto)).rejects.toThrow(
				serviceError,
			);

			expect(service.update).toHaveBeenCalledWith(userId, updateDto);
			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});
	});

	describe("delete", () => {
		it("should call service.delete with userId and id and return the transformed result", async () => {
			const userId = "test-user-id";
			const deleteDto = { id: "deck-id-to-delete" };

			const serviceResult = makeMockDeckDto(deleteDto.id, "pkg1", userId);
			const transformedResult = makeMockDeckDto(deleteDto.id, "pkg1", userId);

			service.delete.mockResolvedValue(serviceResult);
			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await controller.delete(userId, deleteDto);

			expect(service.delete).toHaveBeenCalledWith(userId, deleteDto.id);

			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				DeckDto,
				serviceResult,
			);

			expect(result).toEqual(transformedResult);
		});

		it("should throw exceptions thrown by service.delete", async () => {
			const userId = "test-user-id";
			const deleteDto = { id: "deck-id-to-delete" };
			const serviceError = new BadRequestException("Cannot delete deck");

			service.delete.mockRejectedValue(serviceError);

			await expect(controller.delete(userId, deleteDto)).rejects.toThrow(
				serviceError,
			);

			expect(service.delete).toHaveBeenCalledWith(userId, deleteDto.id);
			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});

		it("should throw NotFoundException if service.delete throws NotFoundException", async () => {
			const userId = "test-user-id";
			const deleteDto = { id: "nonexistent-id" };
			const serviceError = new NotFoundException(
				"Deck not found for this user",
			);

			service.delete.mockRejectedValue(serviceError);

			await expect(controller.delete(userId, deleteDto)).rejects.toThrow(
				serviceError,
			);

			expect(service.delete).toHaveBeenCalledWith(userId, deleteDto.id);
			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});
	});
});
