import {
	BadRequestException,
	Injectable,
	NotFoundException,
	ForbiddenException,
	NotImplementedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Card } from "src/entities/cards.entity";
import { UsersService } from "src/users/users.service";
import { EntityManager, In, Repository } from "typeorm";

import { CardType } from "./common/enum/cardType.enum";
import { CardDto } from "./dto/card.dto";

import { CreateCardDto } from "./dto/create-card.dto";

import { plainToInstance } from "class-transformer";
import { CardContentOrchestratorService } from "./content-create/card-content.orchestrator.service";
import { User } from "src/entities/user.entity";
import { FindCardDto } from "./dto/find.dto";

@Injectable()
export class CardService {
	constructor(
		@InjectRepository(Card)
		private cardRepository: Repository<Card>,

		private readonly cardContentOrchestratorService: CardContentOrchestratorService,

		private readonly usersService: UsersService,
	) {}

	async create(userId: string, cardData: CreateCardDto): Promise<CardDto> {
		const createdCard = await this.cardRepository.manager.transaction(
			async (manager: EntityManager) => {
				const card = manager.create(Card, {
					owner: { id: userId } as User,
					type: cardData.type,
					title: cardData.title,
					description: cardData.description,
					status: "active",
				});
				const savedCard = await manager.save(card);

				await this.cardContentOrchestratorService.createContentForCard(
					manager,
					savedCard,
					cardData,
				);
				// thinking about maybe my card be create but my content is empty
				return savedCard;
			},
		);

		const cardWithContent = await this.cardRepository.findOne({
			where: { id: createdCard.id },
			relations: ["contentFlip"],
		});

		if (!cardWithContent) {
			throw new NotFoundException(
				"Failed to load created card with content after creation.",
			);
		}

		return cardWithContent;
	}

	private async verifyCardOwnership(
		userId: string,
		cardId: string,
	): Promise<Card> {
		const card = await this.cardRepository.findOne({
			where: { id: cardId },
		});

		if (!card) {
			throw new NotFoundException(`Card with ID "${cardId}" not found.`);
		}

		const cardWithOwner = await this.cardRepository.findOne({
			where: { id: cardId },
			relations: ["owner"],
		});

		if (!cardWithOwner) {
			throw new NotFoundException(`Card with ID "${cardId}" not found.`);
		}

		if (!cardWithOwner.owner || cardWithOwner.owner.id !== userId) {
			throw new ForbiddenException("You do not own this card.");
		}

		return cardWithOwner;
	}

	async createBulk(
		userId: string,
		cardsDataArray: CreateCardDto[],
	): Promise<CardDto[]> {
		if (!cardsDataArray || cardsDataArray.length === 0) {
			return [];
		}

		const createdCardsInTransaction =
			await this.cardRepository.manager.transaction(
				async (manager: EntityManager) => {
					const savedCards: Card[] = [];

					for (const cardData of cardsDataArray) {
						const card = manager.create(Card, {
							owner: { id: userId } as User,
							type: cardData.type,
							title: cardData.title,
							description: cardData.description,
							status: "active",
						});

						const savedCard = await manager.save(card);

						await this.cardContentOrchestratorService.createContentForCard(
							manager,
							savedCard,
							cardData,
						);

						savedCards.push(savedCard);
					}

					return savedCards;
				},
			);

		if (createdCardsInTransaction.length === 0) {
			return [];
		}

		const createdCardIds = createdCardsInTransaction.map((card) => card.id);

		const cardsWithContent = await this.cardRepository.find({
			where: { id: In(createdCardIds) },
			relations: ["contentFlip"],
		});

		return cardsWithContent;
	}

	async findById(userId: string, findDto: FindCardDto): Promise<CardDto> {
		const cardId = findDto.id;

		const card = await this.cardRepository.findOne({
			where: {
				id: cardId,
				owner: { id: userId },
			},
			relations: ["contentFlip"],
		});

		if (!card) {
			throw new NotFoundException(
				`Card with ID "${cardId}" not found for user "${userId}"`,
			);
		}
		return card;
	}

	async findAll(userId: string): Promise<CardDto[]> {
		const cards = await this.cardRepository.find({
			where: { owner: { id: userId } },
			relations: ["contentFlip"],
		});

		return cards;
	}

	// async update(userId: string, updateData: UpdateCardDto): Promise<CardDto> {
	// 	console.log(
	// 		`CardService: Attempting to update card ${updateData.id} for user ${userId}.`,
	// 	);

	// 	const cardToUpdate = await this.verifyCardOwnership(userId, updateData.id);

	// 	const updatedCardEntity = await this.cardRepository.manager.transaction(
	// 		async (manager: EntityManager) => {
	// 			manager.merge(Card, cardToUpdate, updateData);

	// 			await this.cardContentOrchestratorService.updateContentForCard(
	// 				manager,
	// 				cardToUpdate,
	// 				updateData,
	// 			);

	// 			const savedCard = await manager.save(cardToUpdate);

	// 			return savedCard;
	// 		},
	// 	);

	// 	const cardAfterUpdate = await this.cardRepository.findOne({
	// 		where: { id: updatedCardEntity.id },

	// 		relations: ["contentFlip"],
	// 	});

	// 	if (!cardAfterUpdate) {
	// 		console.error(
	// 			`CardService: Failed to load card ${updatedCardEntity.id} with relations after update transaction.`,
	// 		);
	// 		throw new NotFoundException(
	// 			`Card with ID "${updatedCardEntity.id}" not found after update process.`,
	// 		);
	// 	}

	// 	const cardDto = plainToInstance(CardDto, cardAfterUpdate, {
	// 		excludeExtraneousValues: true,
	// 	});

	// 	console.log(
	// 		`CardService: Card ${updateData.id} updated successfully. Responding with CardDto.`,
	// 	);
	// 	return cardDto;
	// }

	async delete(userId: string, cardId: string): Promise<CardDto> {
		const cardToDelete = await this.verifyCardOwnership(userId, cardId);

		await this.cardRepository.delete(cardId);

		return cardToDelete;
	}
}
