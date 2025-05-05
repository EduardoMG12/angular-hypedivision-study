import { GetUserId } from "src/common/decorators/getUserId.decorator";
import { CardService } from "./card.service";
import { Body, Controller, Delete, Post } from "@nestjs/common";
import { CreateCardDto } from "./dto/create.dto";
import { toPlainToInstance } from "src/common/utils/toPlainToInstance";

import { CreateMultipleCardsDto } from "./dto/createMultipleCards.dto";
import { CardDto } from "./dto/card.dto";

@Controller("card")
export class CardController {
	constructor(private readonly cardService: CardService) {}

	@Post("/create")
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
	async createBulk(
		@GetUserId() userId: string,
		@Body() cardData: CreateMultipleCardsDto,
	): Promise<CardDto[]> {
		return toPlainToInstance(
			CardDto,
			await this.cardService.createBulk(userId, cardData),
		);
	}

	@Delete()
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
