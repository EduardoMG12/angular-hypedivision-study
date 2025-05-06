import { Expose, Type } from "class-transformer";

import { FlashcardDto } from "./flashcard.dto";
import { ApiProperty } from "@nestjs/swagger";
import { CardType } from "src/card/common/enum/cardType.enum";
import { CardDto } from "src/card/dto/card.dto";
import { PackageDto } from "src/package/dto/package.dto";
import { Package } from "src/entities/package.entity";

export class FlashcardWithPackageDto extends FlashcardDto {
	@ApiProperty({
		description: "The Package when assign Flashcards",
		type: [PackageDto],
		example: [
			{
				frontend: "how can i say ... in english?",
				backend: "como falo isso  ... em ingles",
				flashcardId: "eeb4a3b5-ebed-48ae-a84b-8f24551a4424",
				createdAt: "2025-05-05T17:19:00.108Z",
				type: CardType.Flip,
			},
		],
	})
	@Expose()
	@Type(() => PackageDto)
	declare package: Package | null;
}
