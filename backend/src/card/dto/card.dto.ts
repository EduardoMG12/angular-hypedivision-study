import { IsEnum, IsUUID } from "class-validator";
import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

import { CardType } from "../common/enum/card-type.enum";

import {
	CardContentFlipDto,
	CardContentMultipleChoiceDto,
} from "./content-card/card-content-dto.dto";

import { User } from "src/entities/user.entity";

export class CardDto {
	@ApiProperty({
		description: "The unique identifier of the card.",
		example: "a1b2c3d4-5e6f-7890-1234-567890abcdef",
		format: "uuid",
		readOnly: true,
	})
	@IsUUID()
	@Expose()
	id: string;

	@ApiProperty({
		description: "The title of the card.",
		example: "My Science Flashcard",
		nullable: true,
	})
	@Expose()
	title: string | null;

	@ApiProperty({
		description: "A brief description of the card.",
		example: "Covers basic physics concepts.",
		nullable: true,
	})
	@Expose()
	description: string | null;

	@ApiProperty({
		description: "The current status of the card.",
		example: "active",
	})
	@Expose()
	status: string;

	@ApiProperty({
		description: "The type of the card.",
		enum: CardType,
		example: CardType.Flip,
	})
	@IsEnum(CardType, {
		message: "Type must be a valid value: flip, multiple-choice, etc.",
	})
	@Expose()
	type: CardType;

	@ApiProperty({
		description: "The user who owns this card.",
		type: () => User,
	})
	@Expose()
	@Type(() => User)
	owner: User;

	@ApiProperty({
		description: 'Content specific to Flip cards (present if type is "flip").',
		type: () => CardContentFlipDto,
		nullable: true,
	})
	@Expose()
	@Type(() => CardContentFlipDto)
	contentFlip?: CardContentFlipDto | null;

	@ApiProperty({
		description:
			'Content specific to Multiple Choice cards (present if type is "multiple-choice").',
		type: () => CardContentMultipleChoiceDto,
		nullable: true,
	})
	@Expose()
	@Type(() => CardContentMultipleChoiceDto)
	contentMultipleChoice?: CardContentMultipleChoiceDto | null;

	@ApiProperty({
		description: "The date and time the card was created.",
		example: "2023-10-27T10:00:00Z",
		format: "date-time",
		readOnly: true,
	})
	@Expose()
	createdAt: Date;

	@ApiProperty({
		description: "The date and time the card was last updated (optional).",
		example: "2023-10-27T11:30:00Z",
		format: "date-time",
		nullable: true,
		readOnly: true,
	})
	@Expose()
	updatedAt?: Date | null;
}
