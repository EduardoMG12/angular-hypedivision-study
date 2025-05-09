import { DeckService } from "../deck/deck.service";
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Card } from "src/entities/cards.entity";
import { UsersService } from "src/users/users.service";
import { DeepPartial, Repository } from "typeorm";

import { CardType } from "./common/enum/cardType.enum";
import { CardDto } from "./dto/card.dto";
import { Deck } from "src/entities/decks.entity";
// import { CreateMultipleCardsDto } from "./dto/createMultipleCards.dto";
// import { CreateCardDto } from "./dto/create.dto";
// import { UpdateCardDto } from "./dto/update.dto";
// import { ChangeCardTypeDto } from "./dto/changeType.dto";
// import { FindCardDto } from "./dto/find.dto";

@Injectable()
export class CardService {
	constructor(
		@InjectRepository(Card)
		private cardRepository: Repository<Card>,
		private readonly usersService: UsersService,
		private readonly deckService: DeckService,
	) {}

	// async create(userId: string, cardData: CreateCardDto) {
	// 	const deck = await this.deckService.findById(userId, cardData.deckId);

	// 	const card = this.cardRepository.create({
	// 		frontend: cardData.frontend,
	// 		backend: cardData.backend,
	// 		deck: deck,
	// 		type: cardData.type ?? CardType.Flip,
	// 		createdAt: new Date(),
	// 	});

	// 	return await this.cardRepository.save(card);
	// }

	// async createBulk(
	// 	userId: string,
	// 	cardsDataArray: CreateMultipleCardsDto,
	// ): Promise<CardDto[]> {
	// 	if (!cardsDataArray?.cards?.length) {
	// 		return [];
	// 	}

	// 	const deck = await this.deckService.findById(userId, cardsDataArray.deckId);

	// 	const cardsToCreate: DeepPartial<CardDto>[] = cardsDataArray.cards.map(
	// 		(cardData) => ({
	// 			frontend: cardData.frontend,
	// 			backend: cardData.backend,
	// 			deck: deck as Deck,
	// 			type: cardData.type ?? CardType.Flip,
	// 		}),
	// 	);

	// 	const cardEntities = this.cardRepository.create(cardsToCreate);

	// 	const savedCards = await this.cardRepository.save(cardEntities);

	// 	return savedCards;
	// }

	// // async findAll(userId: string, ) don't need cause exist on decks.findByIdWithCards

	// async findById(userId: string, cardId: FindCardDto): Promise<CardDto> {
	// 	const card = await this.verifyCardOwnership(userId, cardId.id);
	// 	return card;
	// }

	// private async verifyCardOwnership(
	// 	userId: string,
	// 	cardId: string,
	// ): Promise<Card> {
	// 	const card = await this.cardRepository.findOne({
	// 		where: { id: cardId },
	// 		relations: ["deck", "deck.owner"],
	// 	});

	// 	if (!card) {
	// 		throw new NotFoundException(`Card with ID "${cardId}" not found.`);
	// 	}

	// 	if (!card.deck || card.deck.owner.id !== userId) {
	// 		throw new ForbiddenException("You do not own this card.");
	// 	}

	// 	return card;
	// }
	// // async findByIdWithAlternatives

	// async changeType(
	// 	userId: string,
	// 	cardDto: ChangeCardTypeDto,
	// ): Promise<CardDto> {
	// 	const card = await this.verifyCardOwnership(userId, cardDto.cardId);

	// 	if (card.type === cardDto.newType) {
	// 		throw new BadRequestException("Cannot change type for egual type");
	// 	}

	// 	card.type = cardDto.newType;
	// 	return await this.cardRepository.save(card);
	// }

	// async update(userId: string, updateData: UpdateCardDto): Promise<CardDto> {
	// 	const card = await this.verifyCardOwnership(userId, updateData.cardId);

	// 	this.cardRepository.merge(card, updateData);
	// 	return await this.cardRepository.save(card);
	// }

	// async delete(userId: string, cardId: string): Promise<CardDto> {
	// 	const cardToDelete = await this.verifyCardOwnership(userId, cardId);
	// 	await this.cardRepository.delete(cardId);

	// 	return cardToDelete;
	// }
}
