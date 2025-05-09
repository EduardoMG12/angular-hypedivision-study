import { Expose } from "class-transformer";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CardContentFlipDto {
	@ApiProperty({
		description: "The text or content on the front side of the flip card.",
		example: "What is the capital of France?",
	})
	@Expose()
	@IsNotEmpty()
	@IsString()
	front: string;

	@ApiProperty({
		description: "The text or content on the back side of the flip card.",
		example: "Paris",
	})
	@Expose()
	@IsNotEmpty()
	@IsString()
	back: string;
}

export class CardContentMultipleChoiceDto {
	@ApiProperty({
		description: "The question text for the multiple choice card.",
		example: "Which city is the capital of Brazil?",
	})
	@Expose()
	@IsNotEmpty()
	@IsString()
	question: string;

	@ApiProperty({
		description: "The list of answer alternatives for the question.",

		type: [Object],
		example: [
			{ alternative: "Rio de Janeiro", correct_alternative: false },
			{ alternative: "Brasília", correct_alternative: true },
			{ alternative: "São Paulo", correct_alternative: false },
		],
	})
	@Expose()
	@IsArray()
	alternatives: any[];
}
