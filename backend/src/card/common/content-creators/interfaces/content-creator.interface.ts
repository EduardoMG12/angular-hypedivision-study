import { EntityManager } from "typeorm";
import { CardType } from "../../enum/card-type.enum";
import { Card } from "src/entities/cards.entity";
import { CreateCardDto } from "src/card/dto/create-card.dto";

/**
 * Dependency injection token to group all content creators.
 */
export const CONTENT_CREATORS = Symbol("CONTENT_CREATORS");

/**
 * Abstract base class for all specific card content creators.
 * Concrete classes extending this one will handle the creation and validation
 * logic for a specific CardType's content entity.
 */
export abstract class AbstractContentCreator {
	/**
	 * The card type that this creator handles.
	 * Must be defined in each concrete class that extends this one.
	 */
	abstract readonly type: CardType;

	/**
	 * Creates and saves the specific content entity for a card.
	 * Must be implemented by each concrete creator.
	 * This method is called within a database transaction.
	 * @param manager The EntityManager from the ongoing transaction.
	 * @param card The newly created Card entity (already saved, has the ID).
	 * @param createDto The original creation DTO containing content data.
	 * @returns A Promise resolving with the created and saved content entity.
	 */
	abstract createAndSave(
		manager: EntityManager,
		card: Card,
		createDto: CreateCardDto,
	): Promise<object>;

	/**
	 * Optional: Validates the part of the DTO relevant for this content type.
	 * This method is called by the registry before attempting creation.
	 * Can be done here or using Custom Validators in class-validator.
	 * @param createDto The original creation DTO.
	 * @throws BadRequestException if validation fails (e.g., missing content data for the type).
	 */
	validateCreateDto(createDto: CreateCardDto): void {}
}
