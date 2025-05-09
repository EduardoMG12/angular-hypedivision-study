import { Injectable, BadRequestException } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { ContentCreatorRegistry } from "./content-creator.registry";
import { Card } from "src/entities/cards.entity";
import { CreateCardDto } from "../dto/create-card.dto";

/**
 * Service responsible for orchestrating the creation and validation of card content.
 * Delegates content creation and validation to specific content creators via the registry.
 */
@Injectable()
export class CardContentOrchestratorService {
	constructor(private readonly creatorRegistry: ContentCreatorRegistry) {}

	/**
	 * Orchestrates the creation and saving of specific content entities for a card.
	 * Delegates validation and creation to the appropriate creator based on card type.
	 * Must be called within a transaction initiated by CardService.
	 * @param manager - The EntityManager of the ongoing transaction.
	 * @param card - The Card entity that was just saved (includes ID).
	 * @param createDto - The DTO containing content data for the card.
	 * @returns A Promise resolving to the created and saved content entity.
	 * @throws {BadRequestException} If validation fails or the card type is not supported.
	 */
	async createContentForCard(
		manager: EntityManager,
		card: Card,
		createDto: CreateCardDto,
	): Promise<object> {
		const creator = this.creatorRegistry.getCreator(card.type);
		const contentEntity = await creator.createAndSave(manager, card, createDto);
		return contentEntity;
	}

	/**
	 * Validates the creation DTO using the specific content creator.
	 * Can be called before a transaction for complex logical validation not covered by class-validator.
	 * Prefer global ValidationPipe for initial validation when possible.
	 * @param createDto - The creation DTO to validate.
	 * @throws {BadRequestException} If validation fails (e.g., invalid type or missing/incorrect data).
	 */
	validateCreateDto(createDto: CreateCardDto): void {
		const creator = this.creatorRegistry.getCreator(createDto.type);
		creator.validateCreateDto(createDto);
	}
}
