import { Test, TestingModule } from "@nestjs/testing";
import { FlashcardController } from "./flashcard.controller";
import { FlashcardService } from "./flashcard.service";
import { CreateFlashcardDto } from "./dto/create.dto";
import { FlashcardDto } from "./dto/flashcard.dto";
import { ChangeFlashcardStatusDto } from "./dto/changeStatus.dto";
import { UpdateFlashcardDto } from "./dto/update.dto";
import {
	NotFoundException,
	BadRequestException,
	UnauthorizedException,
} from "@nestjs/common";
import { FlashcardStatus } from "./common/enums/flashcardStatus.enum";

let mockToPlainToInstance: jest.Mock;

jest.mock("./../common/utils/toPlainToInstance", () => ({
	toPlainToInstance: jest.fn(),
}));

import { toPlainToInstance } from "./../common/utils/toPlainToInstance";
import { Package } from "src/entities/package.entity";

const makeMockCreateFlashcardDto = (pkgId?: string): CreateFlashcardDto => ({
	title: "Test Flashcard Title",
	description: "Test Description",
	package: pkgId,
	owner: { id: "test-owner-id", name: "Test User" } as any,
	createdAt: new Date(),
	updatedAt: new Date(),
});

const makeMockFlashcardDto = (
	id = "flashcard-id",
	pkgId?: string,
	userId = "user-id",
): FlashcardDto => ({
	id,
	title: "Test Flashcard Title",
	description: "Test Description",

	package: pkgId ? ({ id: pkgId } as Package) : null,
	owner: { id: userId } as any,
	status: "active" as any,
	createdAt: new Date(),
	updatedAt: new Date(),
});

const makeMockChangeFlashcardStatusDto = (
	id = "flashcard-id",
	status = "paused",
): ChangeFlashcardStatusDto => ({
	id,
	status: status as FlashcardStatus,
});

const makeMockUpdateFlashcardDto = (
	id = "flashcard-id",
	updateData: Partial<UpdateFlashcardDto> = {},
): UpdateFlashcardDto => ({
	id,
	...updateData,
});

describe("FlashcardController", () => {
	let controller: FlashcardController;

	let service: jest.Mocked<FlashcardService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [FlashcardController],
			providers: [
				{
					provide: FlashcardService,
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

		controller = module.get<FlashcardController>(FlashcardController);
		service = module.get(FlashcardService) as jest.Mocked<FlashcardService>;

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
			const createDto = makeMockCreateFlashcardDto("package-123");
			const serviceResult = makeMockFlashcardDto(
				"new-flashcard-id",
				createDto.package,
				userId,
			);
			const transformedResult = makeMockFlashcardDto(
				"new-flashcard-id",
				createDto.package,
				userId,
			);

			service.create.mockResolvedValue(serviceResult);

			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await controller.create(userId, createDto);

			expect(service.create).toHaveBeenCalledWith(userId, createDto);

			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				FlashcardDto,
				serviceResult,
			);

			expect(result).toEqual(transformedResult);
		});

		it("should throw the exception thrown by service.create", async () => {
			const userId = "test-user-id";
			const createDto = makeMockCreateFlashcardDto("package-123");
			const serviceError = new BadRequestException(
				"Invalid flashcard data or package ID",
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
			const createDto = makeMockCreateFlashcardDto(undefined);
			const serviceResult = makeMockFlashcardDto(
				"new-flashcard-id",
				undefined,
				userId,
			);
			const transformedResult = makeMockFlashcardDto(
				"new-flashcard-id",
				undefined,
				userId,
			);

			service.create.mockResolvedValue(serviceResult);
			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await controller.create(userId, createDto);

			expect(service.create).toHaveBeenCalledWith(userId, createDto);
			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				FlashcardDto,
				serviceResult,
			);
			expect(result).toEqual(transformedResult);
		});
	});

	describe("findAll", () => {
		it("should call service.findAll with userId and return the transformed array result", async () => {
			const userId = "test-user-id";

			const serviceResult = [
				makeMockFlashcardDto("id1", "pkg1", userId),
				makeMockFlashcardDto("id2", "pkg1", userId),
			];

			const transformedResult = [
				makeMockFlashcardDto("id1", "pkg1", userId),
				makeMockFlashcardDto("id2", "pkg1", userId),
			];

			service.findAll.mockResolvedValue(serviceResult);

			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await controller.findAll(userId);

			expect(service.findAll).toHaveBeenCalledWith(userId);

			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				FlashcardDto,
				serviceResult,
			);

			expect(result).toEqual(transformedResult);
		});

		it("should return an empty array if service.findAll returns an empty array", async () => {
			const userId = "test-user-id";
			const serviceResult: FlashcardDto[] = [];
			const transformedResult: FlashcardDto[] = [];

			service.findAll.mockResolvedValue(serviceResult);
			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await controller.findAll(userId);

			expect(service.findAll).toHaveBeenCalledWith(userId);
			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				FlashcardDto,
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
		it("should call service.findById with userId and id and return the transformed result", async () => {
			const userId = "test-user-id";
			const flashcardId = "flashcard-to-find-id";

			const requestBody = { id: flashcardId };
			const serviceResult = makeMockFlashcardDto(flashcardId, "pkg1", userId);
			const transformedResult = makeMockFlashcardDto(
				flashcardId,
				"pkg1",
				userId,
			);

			service.findById.mockResolvedValue(serviceResult);
			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await controller.findById(userId, requestBody);

			expect(service.findById).toHaveBeenCalledWith(userId, flashcardId);

			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				FlashcardDto,
				serviceResult,
			);

			expect(result).toEqual(transformedResult);
		});

		it("should throw NotFoundException if service.findById throws NotFoundException", async () => {
			const userId = "test-user-id";
			const flashcardId = "nonexistent-id";
			const requestBody = { id: flashcardId };
			const serviceError = new NotFoundException(
				"Flashcard not found for this user",
			);

			service.findById.mockRejectedValue(serviceError);

			await expect(controller.findById(userId, requestBody)).rejects.toThrow(
				serviceError,
			);

			expect(service.findById).toHaveBeenCalledWith(userId, flashcardId);
			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});

		it("should throw other exceptions thrown by service.findById", async () => {
			const userId = "test-user-id";
			const flashcardId = "some-id";
			const requestBody = { id: flashcardId };
			const serviceError = new BadRequestException("Invalid ID format");

			service.findById.mockRejectedValue(serviceError);

			await expect(controller.findById(userId, requestBody)).rejects.toThrow(
				serviceError,
			);

			expect(service.findById).toHaveBeenCalledWith(userId, flashcardId);
			expect(mockToPlainToInstance).not.toHaveBeenCalled();
		});
	});

	describe("changeStatus", () => {
		it("should call service.changeStatus with userId and DTO and return the transformed result", async () => {
			const userId = "test-user-id";
			const changeStatusDto = makeMockChangeFlashcardStatusDto(
				"flashcard-id-to-change",
				"concluded",
			);
			const serviceResult = makeMockFlashcardDto(
				changeStatusDto.id,
				"pkg1",
				userId,
			);
			const transformedResult = makeMockFlashcardDto(
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
				FlashcardDto,
				serviceResult,
			);

			expect(result).toEqual(transformedResult);
		});

		it("should throw exceptions thrown by service.changeStatus", async () => {
			const userId = "test-user-id";
			const changeStatusDto = makeMockChangeFlashcardStatusDto(
				"flashcard-id-to-change",
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
			const changeStatusDto = makeMockChangeFlashcardStatusDto(
				"nonexistent-id",
				"paused",
			);
			const serviceError = new NotFoundException(
				"Flashcard not found for this user",
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
			const updateDto = makeMockUpdateFlashcardDto("flashcard-id-to-update", {
				title: "New Title",
				description: "New Desc",
			});

			const serviceResult = makeMockFlashcardDto(updateDto.id, "pkg1", userId);

			serviceResult.title = updateDto.title ?? serviceResult.title;
			serviceResult.description =
				updateDto.description ?? serviceResult.description;

			const transformedResult = makeMockFlashcardDto(
				updateDto.id,
				"pkg1",
				userId,
			);

			transformedResult.title = updateDto.title ?? transformedResult.title;
			transformedResult.description =
				updateDto.description ?? transformedResult.description;

			service.update.mockResolvedValue(serviceResult);
			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await controller.update(userId, updateDto);

			expect(service.update).toHaveBeenCalledWith(userId, updateDto);

			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				FlashcardDto,
				serviceResult,
			);

			expect(result).toEqual(transformedResult);
		});

		it("should throw exceptions thrown by service.update", async () => {
			const userId = "test-user-id";
			const updateDto = makeMockUpdateFlashcardDto("flashcard-id-to-update", {
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
			const updateDto = makeMockUpdateFlashcardDto("nonexistent-id", {
				title: "Update",
			});
			const serviceError = new NotFoundException(
				"Flashcard not found for this user",
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
			const deleteDto = { id: "flashcard-id-to-delete" };

			const serviceResult = makeMockFlashcardDto(deleteDto.id, "pkg1", userId);
			const transformedResult = makeMockFlashcardDto(
				deleteDto.id,
				"pkg1",
				userId,
			);

			service.delete.mockResolvedValue(serviceResult);
			mockToPlainToInstance.mockReturnValue(transformedResult);

			const result = await controller.delete(userId, deleteDto);

			expect(service.delete).toHaveBeenCalledWith(userId, deleteDto.id);

			expect(mockToPlainToInstance).toHaveBeenCalledWith(
				FlashcardDto,
				serviceResult,
			);

			expect(result).toEqual(transformedResult);
		});

		it("should throw exceptions thrown by service.delete", async () => {
			const userId = "test-user-id";
			const deleteDto = { id: "flashcard-id-to-delete" };
			const serviceError = new BadRequestException("Cannot delete flashcard");

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
				"Flashcard not found for this user",
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
