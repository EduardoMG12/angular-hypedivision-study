import { GetUserId } from "src/common/decorators/getUserId.decorator";
import { CardService } from "./card.service";
import { Body, Controller, Delete, Patch, Post, Put } from "@nestjs/common";
import { CreateCardDto } from "./dto/create.dto";
import { toPlainToInstance } from "src/common/utils/toPlainToInstance";

import { CreateMultipleCardsDto } from "./dto/createMultipleCards.dto";
import { CardDto } from "./dto/card.dto";
import { ChangeCardTypeDto } from "./dto/changeType.dto";
import { UpdateCardDto } from "./dto/update.dto";
import { FindCardDto } from "./dto/find.dto";

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

	@Post("/findById")
	async findById(
		@GetUserId() userId: string,
		@Body() findDto: FindCardDto,
	): Promise<CardDto> {
		return toPlainToInstance(
			CardDto,
			await this.cardService.findById(userId, findDto),
		);
	}

	@Patch("/changeType")
	async changeType(
		@GetUserId() userId: string,
		@Body() cardDto: ChangeCardTypeDto,
	): Promise<CardDto> {
		return toPlainToInstance(
			CardDto,
			await this.cardService.changeType(userId, cardDto),
		);
	}

	@Patch("/update")
	async update(
		@GetUserId() userId: string,
		@Body() updateData: UpdateCardDto,
	): Promise<CardDto> {
		return toPlainToInstance(
			CardDto,
			await this.cardService.update(userId, updateData),
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
