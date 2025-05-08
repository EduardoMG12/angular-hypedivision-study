import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateGroupDecksDto {
	@ApiProperty({
		description: "Group Decks title (required)",
		example: "My new deck for revision",
		maxLength: 100,
		required: true,
	})
	@IsString()
	@MaxLength(100)
	@IsNotEmpty()
	@Expose()
	title: string;

	@ApiProperty({
		description: "Group Decks description is optional",
		example: "Deck to revise NestJS concepts",
		maxLength: 1000,
		required: false,
	})
	@MaxLength(1000)
	@IsOptional()
	@IsString()
	@Expose()
	description?: string;
}
