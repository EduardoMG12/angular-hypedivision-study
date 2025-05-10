import { Expose } from "class-transformer";
import { IsUUID, IsInt, Min } from "class-validator";

export class UpdateCardOrderDto {
	@IsUUID()
	@Expose()
	deckId: string;

	@IsUUID()
	@Expose()
	cardId: string;

	@IsInt()
	@Min(0)
	@Expose()
	newOrder: number;
}
