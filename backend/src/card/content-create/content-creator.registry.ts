import {
	Inject,
	Injectable,
	OnModuleInit,
	BadRequestException,
} from "@nestjs/common";
import {
	AbstractContentCreator,
	CONTENT_CREATORS,
} from "./content-creator.interface";
import { CardType } from "../common/enum/card-type.enum";
import { CreateCardDto } from "../dto/create-card.dto";

/**
 * Registry for managing content creators for different card types.
 * Initializes and provides access to creators based on card type.
 */
@Injectable()
export class ContentCreatorRegistry implements OnModuleInit {
	private readonly creators = new Map<CardType, AbstractContentCreator>();

	constructor(
		@Inject(CONTENT_CREATORS)
		private readonly contentCreators: AbstractContentCreator[],
	) {}

	/**
	 * Initializes the registry by registering all injected content creators.
	 * @throws {Error} If CONTENT_CREATORS is not an array or registration fails.
	 */
	onModuleInit() {
		if (!Array.isArray(this.contentCreators)) {
			throw new Error("CONTENT_CREATORS must be an array.");
		}

		for (const creator of this.contentCreators) {
			if (!(creator instanceof AbstractContentCreator)) {
				continue;
			}
			this.creators.set(creator.type, creator);
		}
	}

	/**
	 * Retrieves the content creator for a given card type.
	 * @param type - The card type.
	 * @returns The content creator instance.
	 * @throws {BadRequestException} If no creator is registered for the type.
	 */
	getCreator(type: CardType): AbstractContentCreator {
		const creator = this.creators.get(type);
		if (!creator) {
			throw new BadRequestException(
				`No content creator registered for card type: ${type}`,
			);
		}
		return creator;
	}

	/**
	 * Validates the creation DTO using the appropriate content creator.
	 * @param createDto - The complete creation DTO.
	 * @throws {BadRequestException} If validation fails (e.g., invalid type or data).
	 */
	validateCreateDto(createDto: CreateCardDto): void {
		const creator = this.getCreator(createDto.type);
		creator.validateCreateDto(createDto);
	}
}
