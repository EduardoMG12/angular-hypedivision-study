import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsOptional, IsUUID } from "class-validator";

export class UpdateDeckReferenceGroupDecksDto {
	@ApiProperty({
		description: "The ID of the a deck when to assign of groupDecks.",
		example: "123e4567-e89b-12d3-a456-426614174000",
		nullable: false,
	})
	@Expose()
	@IsUUID()
	deckId: string;

	@ApiProperty({
		description:
			"The ID of the new groupDecks to assign the deck to. Set to null to remove from any groupDecks.",
		example: "123e4567-e89b-12d3-a456-426614174000",
		nullable: true,
	})
	@Expose()
	@IsOptional()
	@IsUUID()
	groupDecksId?: string;
}
