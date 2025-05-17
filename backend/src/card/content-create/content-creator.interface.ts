import { EntityManager } from "typeorm";
import { CardType } from "../common/enum/card-type.enum";
import { Card } from "src/entities/cards.entity";
import { CreateCardDto } from "../dto/create-card.dto";

/**
 * Injection token for grouping all content creators.
 * Used in the module to register providers and in the registry to inject them as an array.
 */
export const CONTENT_CREATORS = Symbol("CONTENT_CREATORS");

/**
 * Abstract base class for all specific card content creators.
 * Concrete classes extending this handle creation and validation logic for a specific CardType.
 */
export abstract class AbstractContentCreator {
	/**
	 * The card type handled by this creator.
	 * Must be defined in concrete classes (e.g., `readonly type = CardType.Flip`).
	 */
	abstract readonly type: CardType;

	/**
	 * Creates and saves the content entity **specific content entity** for a card.
	 * Must be implemented by concrete creators.
	 * Called within a database transaction.
	 * @param manager - The EntityManager of the ongoing transaction.
	 * @param card - The newly created Card entity (already saved, with ID).
	 * @param createDto - The original creation DTO containing content data.
	 * @returns A Promise resolving to the created and saved content entity.
	 */
	abstract createAndSave(
		manager: EntityManager,
		card: Card,
		createDto: CreateCardDto,
	): Promise<object>;

	/**
	 * Validates the relevant portion of the creation DTO for this content type.
	 * Called by the orchestrator/registry before creating content.
	 * @param createDto - The original creation DTO.
	 * @throws {BadRequestException} If validation fails (e.g., missing or incorrect content data).
	 */
	validateCreateDto(createDto: CreateCardDto): void {}
}
