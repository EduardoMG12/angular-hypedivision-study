import { Expose } from "class-transformer";
import { IsUUID } from "class-validator";

export class RemoveCardFromDeckDto {
	@IsUUID()
	@Expose()
	deckId: string;

	@IsUUID()
	@Expose()
	cardId: string;
}
