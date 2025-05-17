import { Expose } from "class-transformer";
import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FindAllCardsOfDeckDto {
	@IsUUID()
	@Expose()
	@ApiProperty({
		type: String,
		format: "uuid",
		description: "The unique identifier of the deck to retrieve cards from",
		example: "b09ed3bf-355e-480b-9722-21ee99206eb8",
		required: true,
	})
	deckId: string;
}
