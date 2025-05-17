import { Expose } from "class-transformer";
import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RemoveCardFromDeckDto {
	@IsUUID()
	@Expose()
	@ApiProperty({
		type: String,
		format: "uuid",
		description: "The unique identifier of the deck to remove the card from",
		example: "b09ed3bf-355e-480b-9722-21ee99206eb8",
		required: true,
	})
	deckId: string;

	@IsUUID()
	@Expose()
	@ApiProperty({
		type: String,
		format: "uuid",
		description: "The unique identifier of the card to remove from the deck",
		example: "013aab30-e740-482b-9b98-c3f09607ba3f",
		required: true,
	})
	cardId: string;
}
