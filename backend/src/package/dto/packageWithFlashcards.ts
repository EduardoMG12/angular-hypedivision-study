import { Expose, Type } from "class-transformer";
import {
	IsEnum,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
} from "class-validator";
import { User } from "src/entities/user.entity";
import { PackageStatus } from "../common/enums/packageStatus.enum";
import { ApiProperty } from "@nestjs/swagger";
import { PackageDto } from "./package.dto";
import { Flashcard } from "src/entities/flashcards.entity";
import { FlashcardDto } from "src/flashcard/dto/flashcard.dto";

export class PackageWithFlashcardsDto extends PackageDto {
	@ApiProperty({
		description: "List of Flashcards associated with this Package",
		type: [FlashcardDto],
		example: [
			{
				id: "flashcard-id-1",
				title: "Card 1",
				description: "Answer 1",
			},
		],
	})
	@Expose()
	@Type(() => FlashcardDto)
	flashcards: FlashcardDto[];
}
