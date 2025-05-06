import { FlashcardService } from "./../flashcard/flashcard.service";
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cards } from "src/entities/cards.entity";
import { UsersService } from "src/users/users.service";
import { DeepPartial, Repository } from "typeorm";

import { CardType } from "./common/enum/cardType.enum";
import { CardDto } from "./dto/card.dto";
import { Flashcard } from "src/entities/flashcards.entity";
import { CreateMultipleCardsDto } from "./dto/createMultipleCards.dto";
import { CreateCardDto } from "./dto/create.dto";
import { UpdateCardDto } from "./dto/update.dto";
import { ChangeCardTypeDto } from "./dto/changeType.dto";
import { FindCardDto } from "./dto/find.dto";

@Injectable()
export class CardService {
	constructor(
		@InjectRepository(Cards)
		private cardRepository: Repository<Cards>,
		private readonly usersService: UsersService,
		private readonly flashcardService: FlashcardService,
	) {}

	async create(userId: string, cardData: CreateCardDto) {
		await this.usersService.findById(userId);
		const flashcard = await this.flashcardService.findById(
			userId,
			cardData.flashcardId,
		);

		const card = await this.cardRepository.create({
			frontend: cardData.frontend,
			backend: cardData.backend,
			flashcard: flashcard,
			type: cardData.type ?? CardType.Flip,
			createdAt: new Date(),
		});

		return await this.cardRepository.save(card);
	}

	async createBulk(
		userId: string,
		cardsDataArray: CreateMultipleCardsDto,
	): Promise<CardDto[]> {
		if (!cardsDataArray?.cards?.length) {
			return [];
		}

		await this.usersService.findById(userId);
		const flashcard = await this.flashcardService.findById(
			userId,
			cardsDataArray.flashcardId,
		);

		const cardsToCreate: DeepPartial<CardDto>[] = cardsDataArray.cards.map(
			(cardData) => ({
				frontend: cardData.frontend,
				backend: cardData.backend,
				flashcard: flashcard as Flashcard,
				type: cardData.type ?? CardType.Flip,
			}),
		);

		const cardEntities = this.cardRepository.create(cardsToCreate);

		const savedCards = await this.cardRepository.save(cardEntities);

		return savedCards;
	}

	// async findAll(userId: string, ) don't need cause exist on flashcards.findByIdWithCards

	async findById(userId: string, cardId: FindCardDto): Promise<CardDto> {
		const card = await this.verifyCardOwnership(userId, cardId.id);
		return card;
	}

	private async verifyCardOwnership(
		userId: string,
		cardId: string,
	): Promise<Cards> {
		await this.usersService.findById(userId);
		const card = await this.cardRepository.findOne({
			where: { id: cardId },
			relations: ["flashcard", "flashcard.owner"],
		});

		if (!card) {
			throw new NotFoundException(`Card with ID "${cardId}" not found.`);
		}

		if (!card.flashcard || card.flashcard.owner.id !== userId) {
			throw new ForbiddenException("You do not own this card.");
		}

		return card;
	}
	// async findByIdWithAlternatives

	async changeType(
		userId: string,
		cardDto: ChangeCardTypeDto,
	): Promise<CardDto> {
		const card = await this.verifyCardOwnership(userId, cardDto.cardId);

		if (card.type === cardDto.newType) {
			throw new BadRequestException("Cannot change type for egual type");
		}

		card.type = cardDto.newType;
		return await this.cardRepository.save(card);
	}

	async update(userId: string, updateData: UpdateCardDto): Promise<CardDto> {
		const card = await this.verifyCardOwnership(userId, updateData.cardId);

		this.cardRepository.merge(card, updateData);
		return await this.cardRepository.save(card);
	}

	async delete(userId: string, cardId: string): Promise<CardDto> {
		await this.usersService.findById(userId);

		const cardToDelete = await this.verifyCardOwnership(userId, cardId);
		await this.cardRepository.delete(cardId);

		return cardToDelete;
	}
}
