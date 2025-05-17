import {
	IsArray,
	IsEnum,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";
import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

import { CardType } from "../common/enum/card-type.enum";

import {
	CreateCardContentFlipDto,
	CreateCardContentMultipleChoiceDto,
} from "./content-card/create-card-content.dto";

export class CreateCardDto {
	@ApiProperty({
		description: "The type of the card.",
		enum: CardType,
		example: CardType.Flip,
		required: true,
	})
	@IsEnum(CardType, {
		message: "Type must be a valid value: flip, multiple-choice, etc.",
	})
	@Expose()
	type: CardType;

	@ApiProperty({
		description: "The title of the card (optional).",
		example: "Science Basics",
		required: false,
		nullable: true,
	})
	@IsString()
	@IsOptional()
	@Expose()
	title?: string | null;

	@ApiProperty({
		description: "A brief description of the card (optional).",
		example: "Key terms for Unit 1.",
		required: false,
		nullable: true,
	})
	@IsString()
	@IsOptional()
	@Expose()
	description?: string | null;

	@ApiProperty({
		description:
			'Content specific to Flip cards. Required if "type" is "flip".',
		type: () => CreateCardContentFlipDto,
		required: false,
		nullable: true,
	})
	@ValidateNested()
	@Type(() => CreateCardContentFlipDto)
	@IsOptional()
	@Expose()
	contentFlip?: CreateCardContentFlipDto;

	@ApiProperty({
		description:
			'Content specific to Multiple Choice cards. Required if "type" is "multiple-choice".',
		type: () => CreateCardContentMultipleChoiceDto,
		required: false,
		nullable: true,
	})
	@ValidateNested()
	@Type(() => CreateCardContentMultipleChoiceDto)
	@IsOptional()
	@Expose()
	contentMultipleChoice?: CreateCardContentMultipleChoiceDto;

	@ApiProperty({
		description: "Array of tag paths to associate with the card (optional).",
		example: ["programacao::javascript::code", "programacao::python::basics"],
		required: false,
		type: [String],
	})
	@Expose()
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	tagPaths?: string[];
}
