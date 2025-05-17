import { TagService } from "./../tags/tags.service";
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
import { EntityManager, In, IsNull, Repository } from "typeorm";

import { CardType } from "./common/enum/card-type.enum";
import { CardDto } from "./dto/card.dto";

import { CreateCardDto } from "./dto/create-card.dto";

import { plainToInstance } from "class-transformer";
import { CardContentOrchestratorService } from "./content-create/card-content.orchestrator.service";
import { User } from "src/entities/user.entity";
import { FindCardDto } from "./dto/find.dto";
import { CardTag } from "src/entities/card-tags.entity";
import { RemoveSpecificCardOnTag } from "./dto/remove-specific-card-on-tag.dto";
import { MoveCardToTopicDto } from "./dto/move-card-to-topic.dto";
import { Tag } from "src/entities/tags.entity";

@Injectable()
export class CardService {
	constructor(
		@InjectRepository(Card)
		private cardRepository: Repository<Card>,
		@InjectRepository(CardTag)
		private cardTagRepository: Repository<CardTag>,
		private readonly cardContentOrchestratorService: CardContentOrchestratorService,
		private readonly usersService: UsersService,
		private readonly tagService: TagService,
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

				// Associar tags, se fornecidas
				if (cardData.tagPaths && cardData.tagPaths.length > 0) {
					for (const path of cardData.tagPaths) {
						// Buscar ou criar a tag
						let tag = await this.tagService.findByPath(path);
						if (!tag) {
							const segments = path.split("::");
							let parentId: string | undefined;
							let currentPath = "";
							for (const name of segments) {
								if (!name) {
									throw new BadRequestException("Segmento de tag inválido");
								}
								currentPath = currentPath ? `${currentPath}::${name}` : name;
								let existingTag = await this.tagService.findByPath(currentPath);
								if (!existingTag) {
									existingTag = await this.tagService.create(name, parentId);
								}
								parentId = existingTag.id;
							}
							tag = await this.tagService.findByPath(path);
						}

						// Criar associação na tabela card_tags
						const cardTag = manager.create(CardTag, {
							cardId: savedCard.id,
							tagId: tag?.id,
						});
						await manager.save(cardTag);
					}
				}

				return savedCard;
			},
		);

		// Carregar o cartão com conteúdo e tags
		const cardWithContent = await this.cardRepository.findOne({
			where: { id: createdCard.id },
			relations: ["contentFlip", "card_tag", "card_tag.tag"],
		});

		if (!cardWithContent) {
			throw new NotFoundException(
				"Failed to load created card with content after creation.",
			);
		}

		return plainToInstance(CardDto, cardWithContent);
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

						if (cardData.tagPaths && cardData.tagPaths.length > 0) {
							for (const path of cardData.tagPaths) {
								let tag = await this.tagService.findByPath(path);
								if (!tag) {
									const segments = path.split("::");
									let parentId: string | undefined;
									let currentPath = "";
									for (const name of segments) {
										if (!name) {
											throw new BadRequestException("Segmento de tag inválido");
										}
										currentPath = currentPath
											? `${currentPath}::${name}`
											: name;
										let existingTag =
											await this.tagService.findByPath(currentPath);
										if (!existingTag) {
											existingTag = await this.tagService.create(
												name,
												parentId,
											);
										}
										parentId = existingTag.id;
									}
									tag = await this.tagService.findByPath(path);
								}

								const cardTag = manager.create(CardTag, {
									cardId: savedCard.id,
									tagId: tag?.id,
								});
								await manager.save(cardTag);
							}
						}

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
			relations: ["contentFlip", "card_tag", "card_tag.tag"],
		});

		return plainToInstance(CardDto, cardsWithContent);
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

	async findAllWithoutTags(userId: string): Promise<CardDto[]> {
		const cards = await this.cardRepository
			.createQueryBuilder("card")
			.leftJoin("card.owner", "owner")
			.leftJoin("card.card_tag", "cardTag")
			.where("owner.id = :userId", { userId })
			.andWhere("cardTag.id IS NULL")
			.leftJoinAndSelect("card.contentFlip", "contentFlip")
			.getMany();

		return cards as CardDto[];
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

		await this.cardRepository.manager.transaction(
			async (manager: EntityManager) => {
				await manager.delete(CardTag, { cardId });

				await manager.delete(Card, cardId);
			},
		);

		return plainToInstance(CardDto, cardToDelete);
	}

	async removeSpecificCardOnTag(
		userId: string,
		removeTagDto: RemoveSpecificCardOnTag,
	): Promise<CardDto> {
		const { cardId, tagId } = removeTagDto;

		const card = await this.cardRepository.findOne({
			where: { id: cardId },
			relations: ["owner", "card_tag", "card_tag.tag"],
		});

		if (!card) {
			throw new NotFoundException(`Card with ID "${cardId}" not found.`);
		}

		if (!card.owner || card.owner.id !== userId) {
			throw new ForbiddenException("You do not own this card.");
		}

		const cardTag = card.card_tag.find((ct) => ct.tagId === tagId);

		if (!cardTag) {
			throw new NotFoundException(
				`Tag with ID "${tagId}" is not associated with card "${cardId}".`,
			);
		}

		await this.cardRepository.manager.transaction(
			async (manager: EntityManager) => {
				await manager.delete(CardTag, { id: cardTag.id });
			},
		);

		const updatedCard = await this.cardRepository.findOne({
			where: { id: cardId },
			relations: ["contentFlip", "card_tag", "card_tag.tag"],
		});

		if (!updatedCard) {
			throw new NotFoundException(
				`Card with ID "${cardId}" not found after tag removal.`,
			);
		}

		return updatedCard;
	}

	async moveCardToTopic(
		userId: string,
		moveCardToTopicDto: MoveCardToTopicDto,
	): Promise<CardDto> {
		const { cardId, originalTopicId, targetTopicId } = moveCardToTopicDto;

		const card = await this.verifyCardOwnership(userId, cardId);

		let targetTag: Tag | null = null;
		if (targetTopicId) {
			targetTag = await this.tagService.findById(targetTopicId); // Presume que TagService tem findById
			if (!targetTag) {
				throw new NotFoundException(
					`Target topic/tag with ID "${targetTopicId}" not found.`,
				);
			}
			// Se tags tem owner, verifique a propriedade da tag:
			// if (targetTag.ownerId !== userId) {
			//     throw new ForbiddenException(`You do not have access to the target topic/tag with ID "${targetTopicId}".`);
			// }
		} else {
			// Se targetTopicId for nulo/vazio (movendo para "Sem Tag"), você pode adicionar validação extra
			// Por enquanto, a lógica abaixo assume que targetTopicId sempre virá preenchido
			// para mover *para* uma tag. Se quiser mover *para* "Sem Tag", a lógica seria diferente (apenas remover associações existentes).
			throw new BadRequestException("Target topic ID must be provided.");
		}

		// Iniciar uma transação de banco de dados para garantir atomicidade
		const updatedCard = await this.cardRepository.manager.transaction(
			async (manager: EntityManager) => {
				// 1. Remover o card do tópico/tag de origem (se houver)
				if (originalTopicId) {
					// Encontrar a associação CardTag específica para a origem
					const cardTagToRemove = await manager.findOne(CardTag, {
						where: { cardId: card.id, tagId: originalTopicId },
					});

					// Se a associação de origem for encontrada, delete-a
					if (cardTagToRemove) {
						await manager.delete(CardTag, { id: cardTagToRemove.id });
						console.log(
							`Removed CardTag association for card ${card.id} and original tag ${originalTopicId}`,
						);
					} else {
						// Opcional: Logar um aviso se originalTopicId foi fornecido, mas a associação não foi encontrada
						console.warn(
							`Original tag association not found for card ${card.id} and tag ${originalTopicId}. Skipping removal.`,
						);
					}
				}

				// 2. Adicionar o card ao tópico/tag de destino
				// Antes de adicionar, verificar se a associação já existe para evitar duplicatas
				const existingTargetCardTag = await manager.findOne(CardTag, {
					where: { cardId: card.id, tagId: targetTopicId },
				});

				if (!existingTargetCardTag) {
					// Criar a nova associação CardTag para o destino
					const newCardTag = manager.create(CardTag, {
						cardId: card.id,
						tagId: targetTopicId,
						// Adicione campos de ordem se sua tabela CardTag os tiver
						// order: ...
					});
					await manager.save(newCardTag);
					console.log(
						`Created CardTag association for card ${card.id} and target tag ${targetTopicId}`,
					);
				} else {
					console.log(
						`CardTag association for card ${card.id} and target tag ${targetTopicId} already exists. Skipping creation.`,
					);
					// Se a associação já existe, talvez você queira apenas atualizar a ordem se estiver usando ordenação
					// if (targetTag tem ordem) { ... atualizar order aqui ... }
				}

				// Opcional: Atualizar o próprio objeto Card com o novo tópico principal, se você tiver um campo `topicId` direto na tabela `Card`.
				// No seu schema atual, a relação é N:M via `card_tag`, então o "tópico principal" não é armazenado diretamente no Card.
				// Se você quiser que o Card tenha uma referência ao seu tópico "primário" ou mais recente, adicione um campo como `primaryTopicId: string | null` na entidade Card
				// e atualize-o aqui:
				// card.primaryTopicId = targetTopicId;
				// await manager.save(card);

				// Retornar o card atualizado com as novas relações de tags
				// Você pode precisar recarregar o card aqui para garantir que as relações estejam atualizadas
				const cardAfterMove = await manager.findOne(Card, {
					where: { id: card.id },
					relations: ["contentFlip", "card_tag", "card_tag.tag"], // Recarregue as relações de tags
				});

				if (!cardAfterMove) {
					throw new NotFoundException(
						"Failed to load card after move transaction.",
					);
				}

				return cardAfterMove; // Retorna a entidade Card atualizada
			},
		);

		// Converter a entidade Card atualizada para CardDto antes de retornar
		return plainToInstance(CardDto, updatedCard);
	}
}
