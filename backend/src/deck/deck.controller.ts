import {
	Body,
	Delete,
	Get,
	Patch,
	Post,
	Put,
	Controller,
} from "@nestjs/common";
import { GetUserId } from "src/common/decorators/get-user-id.decorator";
import { DeckService } from "./deck.service";
import { CreateDeckDto } from "./dto/create.dto";
import { DeckDto } from "./dto/deck.dto";
import { DeckWithCardsDto } from "./dto/deck-with-cards.dto";
import { ChangeDeckStatusDto } from "./dto/change-status.dto";
import { UpdateDeckDto } from "./dto/update.dto";
import { UpdateDeckReferenceGroupDecksDto } from "./dto/update-deckReferenceGroupDecks.dto";
import { toPlainToInstance } from "src/common/utils/to-plain-to-instance";
import {
	ApiTags,
	ApiOperation,
	ApiBody,
	ApiResponse,
	ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("Deck")
@ApiBearerAuth()
@Controller("deck")
export class DeckController {
	constructor(private readonly deckService: DeckService) {}

	@Post("create")
	@ApiOperation({
		summary: "Create a new deck",
		description: "Creates a new deck for the authenticated user.",
	})
	@ApiBody({ type: CreateDeckDto })
	@ApiResponse({ status: 201, description: "Deck created", type: DeckDto })
	@ApiResponse({ status: 400, description: "Invalid input" })
	@ApiResponse({ status: 404, description: "User or group deck not found" })
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
		summary: "Get all decks",
		description: "Retrieves all decks owned by the user.",
	})
	@ApiResponse({ status: 200, description: "List of decks", type: [DeckDto] })
	@ApiResponse({ status: 404, description: "User not found" })
	async findAll(@GetUserId() userId: string): Promise<DeckDto[]> {
		return toPlainToInstance(DeckDto, await this.deckService.findAll(userId));
	}

	@Post("findById")
	@ApiOperation({
		summary: "Get a deck by ID",
		description: "Retrieves a specific deck by ID.",
	})
	@ApiBody({ type: Object, examples: { example: { value: { id: "uuid" } } } })
	@ApiResponse({ status: 200, description: "Deck found", type: DeckDto })
	@ApiResponse({ status: 404, description: "Deck not found" })
	async findById(
		@GetUserId() userId: string,
		@Body() data: { id: string },
	): Promise<DeckDto> {
		return toPlainToInstance(
			DeckDto,
			await this.deckService.findById(userId, data.id),
		);
	}

	@Post("findByIdWithCards")
	@ApiOperation({
		summary: "Get a deck with its cards",
		description: "Retrieves a deck and its associated cards.",
	})
	@ApiBody({ type: Object, examples: { example: { value: { id: "uuid" } } } })
	@ApiResponse({
		status: 200,
		description: "Deck with cards found",
		type: DeckWithCardsDto,
	})
	@ApiResponse({ status: 404, description: "Deck not found" })
	async findByIdWithCards(
		@GetUserId() userId: string,
		@Body() data: { id: string },
	): Promise<DeckWithCardsDto> {
		return toPlainToInstance(
			DeckWithCardsDto,
			await this.deckService.findByIdWithCards(userId, data.id),
		);
	}

	@Patch("changeStatus")
	@ApiOperation({
		summary: "Change deck status",
		description: "Updates the status of a deck.",
	})
	@ApiBody({ type: ChangeDeckStatusDto })
	@ApiResponse({ status: 200, description: "Status updated", type: DeckDto })
	@ApiResponse({ status: 400, description: "Invalid status change" })
	@ApiResponse({ status: 404, description: "Deck not found" })
	async changeStatus(
		@GetUserId() userId: string,
		@Body() data: ChangeDeckStatusDto,
	): Promise<DeckDto> {
		return toPlainToInstance(
			DeckDto,
			await this.deckService.changeStatus(userId, data),
		);
	}

	@Put("update")
	@ApiOperation({
		summary: "Update a deck",
		description: "Updates deck title or description.",
	})
	@ApiBody({ type: UpdateDeckDto })
	@ApiResponse({ status: 200, description: "Deck updated", type: DeckDto })
	@ApiResponse({ status: 404, description: "Deck not found" })
	async update(
		@GetUserId() userId: string,
		@Body() data: UpdateDeckDto,
	): Promise<DeckDto> {
		return toPlainToInstance(
			DeckDto,
			await this.deckService.update(userId, data),
		);
	}

	@Patch("updateReferenceGroupDecks")
	@ApiOperation({
		summary: "Update group deck reference",
		description: "Assigns or removes a group deck from a deck.",
	})
	@ApiBody({ type: UpdateDeckReferenceGroupDecksDto })
	@ApiResponse({
		status: 200,
		description: "Group deck updated",
		type: DeckDto,
	})
	@ApiResponse({ status: 400, description: "Invalid group deck assignment" })
	@ApiResponse({ status: 404, description: "Deck or group deck not found" })
	async updateReferenceGroupDecks(
		@GetUserId() userId: string,
		@Body() data: UpdateDeckReferenceGroupDecksDto,
	): Promise<DeckDto> {
		return toPlainToInstance(
			DeckDto,
			await this.deckService.updateReferenceGroupDecks(userId, data),
		);
	}

	@Delete()
	@ApiOperation({
		summary: "Delete a deck",
		description: "Deletes a deck and its associated cards.",
	})
	@ApiBody({ type: Object, examples: { example: { value: { id: "uuid" } } } })
	@ApiResponse({ status: 200, description: "Deck deleted", type: DeckDto })
	@ApiResponse({ status: 404, description: "Deck not found" })
	async delete(
		@GetUserId() userId: string,
		@Body() data: { id: string },
	): Promise<DeckDto> {
		return toPlainToInstance(
			DeckDto,
			await this.deckService.delete(userId, data.id),
		);
	}
}
