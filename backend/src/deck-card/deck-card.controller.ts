import { Controller, Post, Delete, Patch, Body, Get } from "@nestjs/common";
import { GetUserId } from "src/common/decorators/get-user-id.decorator";
import { DeckCardService } from "./deck-card.service";
import { AddCardToDeckDto } from "./dto/add-card-to-deck.dto";
import { RemoveCardFromDeckDto } from "./dto/remove-card-from-deck.dto";
import { UpdateCardOrderDto } from "./dto/update-card-order.dto";

import {
	ApiTags,
	ApiOperation,
	ApiBody,
	ApiResponse,
	ApiBearerAuth,
} from "@nestjs/swagger";
import { DeckCardDto } from "./dto/deck-card-dto.dto";
import { FindAllCardsOfDeckDto } from "./dto/find-deck.dto";
import { toPlainToInstance } from "src/common/utils/to-plain-to-instance";

@ApiTags("deck-card")
@ApiBearerAuth()
@Controller("deck-card")
export class DeckCardController {
	constructor(private readonly deckCardService: DeckCardService) {}

	@Post("add")
	@ApiOperation({
		summary: "Add a card to a deck",
		description: "Adds a card to a deck with a specific order.",
	})
	@ApiBody({ type: AddCardToDeckDto })
	@ApiResponse({
		status: 201,
		description: "Card added to deck",
		type: DeckCardDto,
	})
	@ApiResponse({
		status: 400,
		description: "Invalid input or card already in deck",
	})
	@ApiResponse({ status: 404, description: "Deck or card not found" })
	async addCardToDeck(
		@GetUserId() userId: string,
		@Body() dto: AddCardToDeckDto,
	): Promise<DeckCardDto> {
		return toPlainToInstance(
			DeckCardDto,
			await this.deckCardService.addCardToDeck(userId, dto),
		);
	}

	@Delete("remove")
	@ApiOperation({
		summary: "Remove a card from a deck",
		description: "Removes a card from a deck.",
	})
	@ApiBody({ type: RemoveCardFromDeckDto })
	@ApiResponse({ status: 200, description: "Card removed from deck" })
	@ApiResponse({ status: 404, description: "Deck or card not found" })
	async removeCardFromDeck(
		@GetUserId() userId: string,
		@Body() dto: RemoveCardFromDeckDto,
	): Promise<void> {
		await this.deckCardService.removeCardFromDeck(userId, dto);
	}

	@Patch("update-order")
	@ApiOperation({
		summary: "Update card order in a deck",
		description: "Updates the order of a card in a deck.",
	})
	@ApiBody({ type: UpdateCardOrderDto })
	@ApiResponse({
		status: 200,
		description: "Card order updated",
		type: DeckCardDto,
	})
	@ApiResponse({
		status: 400,
		description: "Invalid order or card already in deck",
	})
	@ApiResponse({ status: 404, description: "Deck or card not found" })
	async updateCardOrder(
		@GetUserId() userId: string,
		@Body() dto: UpdateCardOrderDto,
	): Promise<DeckCardDto> {
		return toPlainToInstance(
			DeckCardDto,
			await this.deckCardService.updateCardOrder(userId, dto),
		);
	}

	@Get("find-all")
	@ApiOperation({
		summary: "Get all cards in a deck",
		description: "Retrieves all cards in a deck, ordered by their position.",
	})
	@ApiBody({ type: FindAllCardsOfDeckDto })
	@ApiResponse({
		status: 200,
		description: "List of cards in deck",
		type: [DeckCardDto],
	})
	@ApiResponse({ status: 404, description: "Deck not found" })
	async findCardsInDeck(
		@GetUserId() userId: string,
		@Body() dto: FindAllCardsOfDeckDto,
	): Promise<DeckCardDto[]> {
		return toPlainToInstance(
			DeckCardDto,
			await this.deckCardService.findCardsInDeck(userId, dto.deckId),
		);
	}
}
