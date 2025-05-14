import { GetUserId } from "src/common/decorators/getUserId.decorator";
import { CardService } from "./card.service";
import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	Put,
} from "@nestjs/common";

import { toPlainToInstance } from "src/common/utils/toPlainToInstance";
import { CreateCardDto } from "./dto/create-card.dto";
import { CardDto } from "./dto/card.dto";
import { FindCardDto } from "./dto/find.dto";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("card")
export class CardController {
	constructor(private readonly cardService: CardService) {}

	@Post("/create")
	@ApiOperation({
		summary: "Create a new card",
		description: "Creates a new card for the authenticated user.",
	})
	@ApiBody({ type: CreateCardDto, description: "Data for the new card" })
	@ApiResponse({
		status: 201,
		description: "Card created successfully",
		type: CardDto,
	})
	@ApiResponse({ status: 400, description: "Invalid card data provided" })
	@ApiResponse({
		status: 401,
		description: "Unauthorized - Invalid or missing token",
	})
	@ApiResponse({
		status: 403,
		description: "Forbidden - User lacks permission",
	})
	async create(
		@GetUserId() userId: string,
		@Body() cardData: CreateCardDto,
	): Promise<CardDto> {
		return toPlainToInstance(
			CardDto,
			await this.cardService.create(userId, cardData),
		);
	}

	@Post("/createBulk")
	@ApiOperation({
		summary: "Create multiple cards",
		description:
			"Creates multiple cards for the authenticated user in a single request.",
	})
	@ApiBody({ type: [CreateCardDto], description: "Array of card data" })
	@ApiResponse({
		status: 201,
		description: "Cards created successfully",
		type: [CardDto],
	})
	@ApiResponse({ status: 400, description: "Invalid card data provided" })
	@ApiResponse({
		status: 401,
		description: "Unauthorized - Invalid or missing token",
	})
	@ApiResponse({
		status: 403,
		description: "Forbidden - User lacks permission",
	})
	async createBulk(
		@GetUserId() userId: string,
		@Body() cardData: CreateCardDto[],
	): Promise<CardDto[]> {
		return toPlainToInstance(
			CardDto,
			await this.cardService.createBulk(userId, cardData),
		);
	}

	// @Patch("/update")
	// async update(
	// 	@GetUserId() userId: string,
	// 	@Body() updateData: UpdateCardDto,
	// ): Promise<CardDto> {
	// 	return toPlainToInstance(
	// 		CardDto,
	// 		await this.cardService.update(userId, updateData),
	// 	);
	// }

	@Post("/findById")
	@ApiOperation({
		summary: "Find a card by ID",
		description:
			"Retrieves a specific card by its ID for the authenticated user.",
	})
	@ApiBody({ type: FindCardDto, description: "Card ID to find" })
	@ApiResponse({ status: 200, description: "Card found", type: CardDto })
	@ApiResponse({ status: 400, description: "Invalid card ID provided" })
	@ApiResponse({
		status: 401,
		description: "Unauthorized - Invalid or missing token",
	})
	@ApiResponse({ status: 404, description: "Card not found" })
	async findById(
		@GetUserId() userId: string,
		@Body() findDto: FindCardDto,
	): Promise<CardDto> {
		return toPlainToInstance(
			CardDto,
			await this.cardService.findById(userId, findDto),
		);
	}

	@Get("/findAll")
	@ApiOperation({
		summary: "Find all cards",
		description: "Retrieves all cards owned by the authenticated user.",
	})
	@ApiResponse({ status: 200, description: "List of cards", type: [CardDto] })
	@ApiResponse({
		status: 401,
		description: "Unauthorized - Invalid or missing token",
	})
	async findAll(@GetUserId() userId: string): Promise<CardDto[]> {
		return toPlainToInstance(CardDto, await this.cardService.findAll(userId));
	}

	@Get("/findAllWithoutTags")
	@ApiOperation({
		summary: "Find all cards without tags",
		description:
			"Retrieves all cards owned by the authenticated user that do not have any tags.",
	})
	@ApiResponse({
		status: 200,
		description: "List of cards without tags",
		type: [CardDto],
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized - Invalid or missing token",
	})
	async findAllWithoutTags(@GetUserId() userId: string): Promise<CardDto[]> {
		return toPlainToInstance(
			CardDto,
			await this.cardService.findAllWithoutTags(userId),
		);
	}
	@Delete()
	@ApiOperation({
		summary: "Delete a card",
		description:
			"Deletes a specific card by its ID for the authenticated user.",
	})
	@ApiBody({
		type: Object,
		description: "Card ID to delete",
		examples: { example: { value: { id: "uuid" } } },
	})
	@ApiResponse({
		status: 200,
		description: "Card deleted successfully",
		type: CardDto,
	})
	@ApiResponse({ status: 400, description: "Invalid card ID provided" })
	@ApiResponse({
		status: 401,
		description: "Unauthorized - Invalid or missing token",
	})
	@ApiResponse({
		status: 403,
		description: "Forbidden - User does not own the card",
	})
	@ApiResponse({ status: 404, description: "Card not found" })
	async delete(
		@GetUserId() userId: string,
		@Body() deleteDto: { id: string },
	): Promise<CardDto> {
		return toPlainToInstance(
			CardDto,
			await this.cardService.delete(userId, deleteDto.id),
		);
	}
}
