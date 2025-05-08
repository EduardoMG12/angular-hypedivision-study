import { Expose, Type } from "class-transformer";

import { DeckDto } from "./deck.dto";
import { ApiProperty } from "@nestjs/swagger";
import { CardType } from "src/card/common/enum/cardType.enum";
import { PackageDto } from "src/package/dto/package.dto";
import { Package } from "src/entities/package.entity";

export class DeckWithPackageDto extends DeckDto {
	@ApiProperty({
		description: "The Package when assign Decks",
		type: [PackageDto],
		example: [
			{
				frontend: "how can i say ... in english?",
				backend: "como falo isso  ... em ingles",
				deckId: "eeb4a3b5-ebed-48ae-a84b-8f24551a4424",
				createdAt: "2025-05-05T17:19:00.108Z",
				type: CardType.Flip,
			},
		],
	})
	@Expose()
	@Type(() => PackageDto)
	declare package: Package | null;
}
