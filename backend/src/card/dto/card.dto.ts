import { Expose } from "class-transformer";
import { IsEnum, IsString, IsUUID } from "class-validator";
import { CardType } from "../common/enum/cardType.enum";
import { Deck } from "src/entities/decks.entity";

export class CardDto {
	@IsUUID()
	@Expose()
	id: string;

	@Expose()
	deck: Deck | null;

	@IsEnum(CardType, {
		message: "Status can be valide value: flip, multiple-choice",
	})
	@Expose()
	type: CardType;

	@IsString()
	@Expose()
	frontend: string;

	@IsString()
	@Expose()
	backend: string;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;
}
