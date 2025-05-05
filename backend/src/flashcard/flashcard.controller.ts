import { Body, Delete, Get, Post, Put } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { GetUserId } from "src/common/decorators/getUserId.decorator";
import { toPlainToInstance } from "src/common/utils/toPlainToInstance";

import { CreateFlashcardDto } from "./dto/create.dto";
import { FlashcardDto } from "./dto/flashcard.dto";
import { ChangeFlashcardStatusDto } from "./dto/changeStatus.dto";
import { UpdateFlashcardDto } from "./dto/update.dto";

import { FlashcardService } from "./flashcard.service";

import {
	ApiTags,
	ApiOperation,
	ApiBody,
	ApiResponse,
	ApiBearerAuth,
} from "@nestjs/swagger";
import { FlashcardWithCardsDto } from "./dto/flashcardWithCards.dto";

@ApiTags("Flashcard")
@ApiBearerAuth()
@Controller("flashcard")
export class FlashcardController {
	constructor(private flashcardService: FlashcardService) {}

	@Post("create")
	@ApiOperation({
		summary: "Create a new Flashcard",
		description:
			"Creates a new Flashcard associated with the authenticated user and optionally links it to a Package.",
	})

	@ApiBody({
		type: CreateFlashcardDto,
		description: "Data for creating the Flashcard",
	})
	@ApiResponse({
		status: 201,
		description: "Flashcard created successfully",

		type: FlashcardDto,
	})
	@ApiResponse({
		status: 400,
		description: "Bad Request (validation errors or business logic errors)",
	})
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({
		status: 404,
		description: "User or associated Package not found",
	})
	async create(
		@GetUserId() userId: string,
		@Body() flashcardData: CreateFlashcardDto,
	): Promise<FlashcardDto> {
		return toPlainToInstance(
			FlashcardDto,
			await this.flashcardService.create(userId, flashcardData),
		);
	}

	@Get("findAll")
	@ApiOperation({
		summary: "List all Flashcards for the authenticated user",
		description:
			"Returns a list of all Flashcards belonging to the authenticated user.",
	})
	@ApiResponse({
		status: 200,
		description: "List of Flashcards returned successfully (can be empty)",

		type: [FlashcardDto],
	})
	@ApiResponse({ status: 401, description: "Unauthorized" })
	async findAll(@GetUserId() userId: string): Promise<FlashcardDto[]> {
		return toPlainToInstance(
			FlashcardDto,
			await this.flashcardService.findAll(userId),
		);
	}

	@Post("findById")
	@ApiOperation({
		summary: "Find a specific Flashcard by ID for the authenticated user",
		description:
			"Returns a specific Flashcard belonging to the authenticated user, given its ID.",
	})

	@ApiBody({
		type: Object,
		description: "ID of the Flashcard to find",
		examples: {
			"application/json": {
				value: { id: "f1a2b3c4-d5e6-7890-1234-56789abcdef0" },
				summary: "Example body for finding by ID",
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: "Flashcard found successfully",

		type: FlashcardDto,
	})
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({
		status: 404,
		description: "Flashcard not found for this user",
	})
	async findById(
		@GetUserId() userId: string,
		@Body() packageData: { id: string },
	): Promise<FlashcardDto> {
		return toPlainToInstance(
			FlashcardDto,
			await this.flashcardService.findById(userId, packageData.id),
		);
	}

	@Post("findByIdWithCards")
	async findByIdWithCards(
		@GetUserId() userId: string,
		@Body() packageData: { id: string },
	): Promise<FlashcardWithCardsDto> {
		return toPlainToInstance(
			FlashcardWithCardsDto,
			await this.flashcardService.findByIdWithCards(userId, packageData.id),
		);
	}

	@Post("changeStatus")
	@ApiOperation({
		summary: "Change the status of a Flashcard",
		description:
			"Changes the status of a specific Flashcard belonging to the authenticated user.",
	})

	@ApiBody({
		type: ChangeFlashcardStatusDto,
		description: "Flashcard ID and the new Status",
	})
	@ApiResponse({
		status: 200,
		description: "Flashcard status changed successfully",

		type: FlashcardDto,
	})
	@ApiResponse({
		status: 400,
		description: "Bad Request (validation or invalid transition)",
	})
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({
		status: 404,
		description: "Flashcard not found for this user",
	})
	async changeStatus(
		@GetUserId() userId: string,
		@Body() changeStatusDto: ChangeFlashcardStatusDto,
	): Promise<FlashcardDto> {
		return toPlainToInstance(
			FlashcardDto,
			await this.flashcardService.changeStatus(userId, changeStatusDto),
		);
	}

	@Put("update")
	@ApiOperation({
		summary: "Update an existing Flashcard",
		description:
			"Updates the data of a specific Flashcard belonging to the authenticated user.",
	})

	@ApiBody({
		type: UpdateFlashcardDto,
		description: "Data for updating the Flashcard (includes ID)",
	})
	@ApiResponse({
		status: 200,
		description: "Flashcard updated successfully",

		type: FlashcardDto,
	})
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({
		status: 404,
		description: "Flashcard not found for this user",
	})
	async update(
		@GetUserId() userId: string,
		@Body() packageData: UpdateFlashcardDto,
	): Promise<FlashcardDto> {
		return toPlainToInstance(
			FlashcardDto,
			await this.flashcardService.update(userId, packageData),
		);
	}

	@Delete("")
	@ApiOperation({
		summary: "Delete a Flashcard",
		description:
			"Deletes a specific Flashcard belonging to the authenticated user, given its ID.",
	})

	@ApiBody({
		type: Object,
		description: "ID of the Flashcard to delete",
		examples: {
			"application/json": {
				value: { id: "f1a2b3c4-d5e6-7890-1234-56789abcdef0" },
				summary: "Example body for deleting by ID",
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: "Flashcard deleted successfully",

		type: FlashcardDto,
	})
	@ApiResponse({
		status: 204,
		description: "Flashcard deleted successfully (No Content response)",
	})
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({
		status: 404,
		description: "Flashcard not found for this user",
	})
	async delete(
		@GetUserId() userId: string,
		@Body() deleteDto: { id: string },
	): Promise<FlashcardDto> {
		return toPlainToInstance(
			FlashcardDto,
			await this.flashcardService.delete(userId, deleteDto.id),
		);
	}
}
