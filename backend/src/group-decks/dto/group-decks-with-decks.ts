import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { GroupDecksDto } from "./group-decks.dto";
import { DeckDto } from "src/deck/dto/deck.dto";

export class GroupDecksWithDecksDto extends GroupDecksDto {
	@ApiProperty({
		description: "List of Decks associated with this GroupDecks",
		type: [DeckDto],
		example: [
			{
				id: "deck-id-1",
				title: "Card 1",
				description: "Answer 1",
			},
		],
	})
	@Expose()
	@Type(() => DeckDto)
	decks: DeckDto[];
}
