import { EntityManager, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, BadRequestException } from "@nestjs/common";
import { AbstractContentCreator } from "./content-creator.interface";
import { CardType } from "../common/enum/cardType.enum";
import { CardContentFlip } from "src/entities/cardContentFlip.entity";
import { CreateCardDto } from "../dto/create-card.dto";
import { CreateCardContentFlipDto } from "../dto/content-card/create-card-content.dto";
import { Card } from "src/entities/cards.entity";

/**
 * Content creator for flip-type cards.
 * Handles validation and creation of flip card content.
 */
@Injectable()
export class FlipContentCreator extends AbstractContentCreator {
	readonly type = CardType.Flip;

	constructor(
		@InjectRepository(CardContentFlip)
		private contentRepository: Repository<CardContentFlip>,
	) {
		super();
	}

	/**
	 * Validates the creation DTO for flip card content.
	 * @param createDto - The creation DTO.
	 * @throws {BadRequestException} If content data is missing or invalid.
	 */
	validateCreateDto(createDto: CreateCardDto): void {
		if (!createDto.contentFlip) {
			throw new BadRequestException(
				`Content data missing for card type ${this.type}`,
			);
		}

		const flipContentDto = createDto.contentFlip as CreateCardContentFlipDto;
		if (!flipContentDto.front || !flipContentDto.back) {
			throw new BadRequestException(
				`'front' and 'back' are required for Flip content`,
			);
		}
	}

	/**
	 * Creates and saves the flip card content entity.
	 * @param manager - The EntityManager of the ongoing transaction.
	 * @param card - The Card entity (already saved, with ID).
	 * @param createDto - The creation DTO containing flip content data.
	 * @returns A Promise resolving to the saved flip content entity.
	 */
	async createAndSave(
		manager: EntityManager,
		card: Card,
		createDto: CreateCardDto,
	): Promise<CardContentFlip> {
		const flipContentDto = createDto.contentFlip as CreateCardContentFlipDto;
		const contentEntity = manager.create(CardContentFlip, {
			cardId: card.id,
			front: flipContentDto.front,
			back: flipContentDto.back,
		});
		return manager.save(contentEntity);
	}
}
