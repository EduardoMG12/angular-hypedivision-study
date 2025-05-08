import { Body, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { GetUserId } from "src/common/decorators/getUserId.decorator";
import { toPlainToInstance } from "src/common/utils/toPlainToInstance";

import { CreateDeckDto } from "./dto/create.dto";
import { DeckDto } from "./dto/deck.dto";
import { ChangeDeckStatusDto } from "./dto/changeStatus.dto";
import { UpdateDeckDto } from "./dto/update.dto";

import { DeckService } from "./deck.service";

import {
	ApiTags,
	ApiOperation,
	ApiBody,
	ApiResponse,
	ApiBearerAuth,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { DeckWithCardsDto } from "./dto/deckWithCards.dto";
import { UpdateDeckReferencePackageDto } from "./dto/updateDeckReferencePackage.dto";
import { DeckWithPackageDto } from "./dto/deckWithPackage.dto";

@ApiTags("Deck")
@ApiBearerAuth()
@Controller("deck")
export class DeckController {
	constructor(private deckService: DeckService) {}

	@Post("create")
	@ApiOperation({
		summary: "Create a new Deck",
		description:
			"Creates a new Deck associated with the authenticated user and optionally links it to a Package.",
	})

	@ApiBody({
		type: CreateDeckDto,
		description: "Data for creating the Deck",
	})
	@ApiResponse({
		status: 201,
		description: "Deck created successfully",

		type: DeckDto,
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
		@Body() deckData: CreateDeckDto,
	): Promise<DeckDto> {
		return toPlainToInstance(
			DeckDto,
			await this.deckService.create(userId, deckData),
		);
	}

	@Get("findAll")
	@ApiOperation({
		summary: "List all Decks for the authenticated user",
		description:
			"Returns a list of all Decks belonging to the authenticated user.",
	})
	@ApiResponse({
		status: 200,
		description: "List of Decks returned successfully (can be empty)",

		type: [DeckDto],
	})
	@ApiResponse({ status: 401, description: "Unauthorized" })
	async findAll(@GetUserId() userId: string): Promise<DeckDto[]> {
		return toPlainToInstance(DeckDto, await this.deckService.findAll(userId));
	}

	@Post("findById")
	@ApiOperation({
		summary: "Find a specific Deck by ID for the authenticated user",
		description:
			"Returns a specific Deck belonging to the authenticated user, given its ID.",
	})

	@ApiBody({
		type: Object,
		description: "ID of the Deck to find",
		examples: {
			"application/json": {
				value: { id: "f1a2b3c4-d5e6-7890-1234-56789abcdef0" },
				summary: "Example body for finding by ID",
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: "Deck found successfully",

		type: DeckDto,
	})
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({
		status: 404,
		description: "Deck not found for this user",
	})
	async findById(
		@GetUserId() userId: string,
		@Body() packageData: { id: string },
	): Promise<DeckDto> {
		return toPlainToInstance(
			DeckDto,
			await this.deckService.findById(userId, packageData.id),
		);
	}

	@Post("findByIdWithCards")
	async findByIdWithCards(
		@GetUserId() userId: string,
		@Body() packageData: { id: string },
	): Promise<DeckWithCardsDto> {
		return toPlainToInstance(
			DeckWithCardsDto,
			await this.deckService.findByIdWithCards(userId, packageData.id),
		);
	}

	@Patch("changeStatus")
	@ApiOperation({
		summary: "Change the status of a Deck",
		description:
			"Changes the status of a specific Deck belonging to the authenticated user.",
	})

	@ApiBody({
		type: ChangeDeckStatusDto,
		description: "Deck ID and the new Status",
	})
	@ApiResponse({
		status: 200,
		description: "Deck status changed successfully",

		type: DeckDto,
	})
	@ApiResponse({
		status: 400,
		description: "Bad Request (validation or invalid transition)",
	})
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({
		status: 404,
		description: "Deck not found for this user",
	})
	async changeStatus(
		@GetUserId() userId: string,
		@Body() changeStatusDto: ChangeDeckStatusDto,
	): Promise<DeckDto> {
		return toPlainToInstance(
			DeckDto,
			await this.deckService.changeStatus(userId, changeStatusDto),
		);
	}

	@Put("update")
	@ApiOperation({
		summary: "Update an existing Deck",
		description:
			"Updates the data of a specific Deck belonging to the authenticated user.",
	})

	@ApiBody({
		type: UpdateDeckDto,
		description: "Data for updating the Deck (includes ID)",
	})
	@ApiResponse({
		status: 200,
		description: "Deck updated successfully",

		type: DeckDto,
	})
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({
		status: 404,
		description: "Deck not found for this user",
	})
	async update(
		@GetUserId() userId: string,
		@Body() packageData: UpdateDeckDto,
	): Promise<DeckDto> {
		return toPlainToInstance(
			DeckDto,
			await this.deckService.update(userId, packageData),
		);
	}

	@ApiBearerAuth()
	@ApiOperation({
		summary: "Assign or remove a package for a deck",
		description:
			"Assigns a deck to a new package or removes it from its current package by setting packageId to null.",
	})
	@ApiResponse({
		status: 200,
		description: "Deck package updated successfully",
		type: DeckDto,
	})
	@ApiUnauthorizedResponse({
		description: "Unauthorized: Missing, invalid, or expired token",
	})
	@ApiResponse({
		status: 400,
		description: "Invalid deck ID or package already assigned",
	})
	@Patch("/updateRefencePackage")
	async assignPackage(
		@GetUserId() userId: string,
		@Body() updatePackageDto: UpdateDeckReferencePackageDto,
	): Promise<DeckWithPackageDto> {
		return toPlainToInstance(
			DeckWithPackageDto,
			await this.deckService.updateReferencePackage(userId, updatePackageDto),
		);
	}

	@Delete("")
	@ApiOperation({
		summary: "Delete a Deck",
		description:
			"Deletes a specific Deck belonging to the authenticated user, given its ID.",
	})

	@ApiBody({
		type: Object,
		description: "ID of the Deck to delete",
		examples: {
			"application/json": {
				value: { id: "f1a2b3c4-d5e6-7890-1234-56789abcdef0" },
				summary: "Example body for deleting by ID",
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: "Deck deleted successfully",

		type: DeckDto,
	})
	@ApiResponse({
		status: 204,
		description: "Deck deleted successfully (No Content response)",
	})
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({
		status: 404,
		description: "Deck not found for this user",
	})
	async delete(
		@GetUserId() userId: string,
		@Body() deleteDto: { id: string },
	): Promise<DeckDto> {
		return toPlainToInstance(
			DeckDto,
			await this.deckService.delete(userId, deleteDto.id),
		);
	}
}
