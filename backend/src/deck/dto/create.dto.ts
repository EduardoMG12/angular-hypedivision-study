import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDeckDto {
	@IsString()
	@IsNotEmpty()
	@Expose()
	@ApiProperty({
		type: String,
		description: "The title of the deck",
		example: "English Grammar",
		required: true,
	})
	title: string;

	@IsString()
	@IsOptional()
	@Expose()
	@ApiProperty({
		type: String,
		description: "A description of the deck",
		example: "A deck for practicing English grammar concepts",
		required: false,
		nullable: true,
	})
	description?: string;

	@IsUUID()
	@IsOptional()
	@Expose()
	@ApiProperty({
		type: String,
		format: "uuid",
		description: "The ID of the group deck to associate with this deck, if any",
		example: "0a172ec9-0df9-4fc8-a4ec-131207fe5831",
		required: false,
		nullable: true,
	})
	groupDecksId?: string;
}
