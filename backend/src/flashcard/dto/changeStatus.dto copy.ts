import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import {
	IsEnum,
	IsNotEmpty,
	IsString,
	IsUUID,
	MaxLength,
} from "class-validator";
import { FlashcardStatus } from "../common/enums/flashcardStatus.enum";

export class ChangeFlashcardStatusDto {
	@ApiProperty({
		description: "ID of Flashcard can be changed",
		example: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
		format: "uuid",
	})
	@Expose()
	@IsUUID()
	@IsNotEmpty()
	id: string;

	@ApiProperty({
		description: "New status of Flashcard",
		enum: FlashcardStatus,
		example: FlashcardStatus.Active,
		maxLength: 20,
	})
	@Expose()
	@IsString()
	@IsNotEmpty()
	@IsEnum(FlashcardStatus, {
		message: "Status can be valide value: active, paused, concluded, working",
	})
	@MaxLength(20)
	status: FlashcardStatus;
}
