import { Expose } from "class-transformer";
import { IsUUID, IsInt, Min } from "class-validator";

export class AddCardToDeckDto {
	@IsUUID()
	@Expose()
	deckId: string;

	@IsUUID()
	@Expose()
	cardId: string;

	@IsInt()
	@Expose()
	@Min(0)
	order: number;
}
