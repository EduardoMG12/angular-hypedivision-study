import { Expose } from "class-transformer";
import { IsEnum, IsString, IsUUID } from "class-validator";
import { Flashcard } from "src/entities/flashcards.entity";
import { CardType } from "../common/enum/cardType.enum";

export class CardDto {
	@IsUUID()
	@Expose()
	id: string;

	@Expose()
	flashcard: Flashcard | null;

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
