import {
	ArrayNotEmpty,
	IsArray,
	IsString,
	IsUUID,
	ValidateNested,
	IsEnum,
	IsOptional,
} from "class-validator";
import { Expose, Type } from "class-transformer";
import { CardType } from "../common/enum/cardType.enum";

class LocalCreateCardDto {
	@IsOptional()
	@IsEnum(CardType, {
		message: "Status can be valide value: flip, multiple-choice",
	})
	@Expose()
	type?: CardType;

	@IsString()
	@Expose()
	frontend: string;

	@IsString()
	@Expose()
	backend: string;
}

export class CreateMultipleCardsDto {
	@IsUUID()
	@Expose()
	flashcardId: string;

	@Expose()
	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => LocalCreateCardDto)
	cards: LocalCreateCardDto[];
}
