import { Expose } from "class-transformer";
import { IsUUID } from "class-validator";

export class FindAllCardsOfDeckDto {
	@Expose()
	@IsUUID()
	deckId: string;
}
