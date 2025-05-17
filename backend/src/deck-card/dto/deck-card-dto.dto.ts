import { CardDto } from "src/card/dto/card.dto";
import { Expose, Type } from "class-transformer";
import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DeckCardDto {
	@IsUUID()
	@Expose()
	@ApiProperty({
		type: String,
		format: "uuid",
		description: "The unique identifier of the deck-card association",
		example: "7f4c2b9d-8e3a-4f2b-9c1d-6a8b3e4f5c9d",
		required: true,
	})
	id: string;

	@IsUUID()
	@Expose()
	@ApiProperty({
		type: String,
		format: "uuid",
		description: "The unique identifier of the deck",
		example: "b09ed3bf-355e-480b-9722-21ee99206eb8",
		required: true,
	})
	deckId: string;

	@IsUUID()
	@Expose()
	@ApiProperty({
		type: String,
		format: "uuid",
		description: "The unique identifier of the card",
		example: "013aab30-e740-482b-9b98-c3f09607ba3f",
		required: true,
	})
	cardId: string;

	@Type(() => CardDto)
	@Expose()
	@ApiProperty({
		type: CardDto,
		description: "The card details associated with this deck-card entry",
		example: {
			id: "013aab30-e740-482b-9b98-c3f09607ba3f",
			title: "English Grammar: Present Perfect",
			description: null,
		},
		required: true,
	})
	card: CardDto;

	order: number | null;

	@Expose()
	createdAt: Date;
}
