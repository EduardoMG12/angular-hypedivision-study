import { Expose, Type } from "class-transformer";
import { IsUUID } from "class-validator";
import { CardDto } from "src/card/dto/card.dto";

export class DeckCardDto {
	@IsUUID()
	@Expose()
	id: string;

	@IsUUID()
	@Expose()
	deckId: string;

	@IsUUID()
	@Expose()
	cardId: string;

	@Type(() => CardDto)
	card: CardDto;

	order: number | null;

	@Expose()
	createdAt: Date;
}
