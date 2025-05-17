import { Expose } from "class-transformer";
import { IsInt, IsUUID, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddCardToDeckDto {
	@IsUUID()
	@Expose()
	@ApiProperty({
		type: String,
		format: "uuid",
		description: "The unique identifier of the deck to add the card to",
		example: "b09ed3bf-355e-480b-9722-21ee99206eb8",
		required: true,
	})
	deckId: string;

	@IsUUID()
	@Expose()
	@ApiProperty({
		type: String,
		format: "uuid",
		description: "The unique identifier of the card to add to the deck",
		example: "013aab30-e740-482b-9b98-c3f09607ba3f",
		required: true,
	})
	cardId: string;

	@IsInt()
	@Min(0)
	@Expose()
	@ApiProperty({
		type: Number,
		description: "The order position of the card in the deck",
		example: 1,
		required: true,
	})
	order: number;
}
