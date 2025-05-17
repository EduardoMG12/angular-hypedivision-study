import { Expose } from "class-transformer";
import { IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateDeckDto {
	@Expose()
	@IsUUID()
	@ApiProperty({
		type: String,
		format: "uuid",
		description: "The unique identifier of the deck to update",
		example: "b09ed3bf-355e-480b-9722-21ee99206eb8",
		required: true,
	})
	id: string;

	@Expose()
	@IsString()
	@MaxLength(100)
	@IsOptional()
	@ApiProperty({
		type: String,
		description: "The new title of the deck",
		example: "Advanced English Grammar",
		required: false,
		maxLength: 100,
	})
	title?: string;

	@Expose()
	@IsString()
	@IsOptional()
	@ApiProperty({
		type: String,
		description: "The new description of the deck",
		example: "Updated deck for advanced grammar practice",
		required: false,
		nullable: true,
	})
	description?: string;
}
