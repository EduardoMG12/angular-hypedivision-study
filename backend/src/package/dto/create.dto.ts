import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
} from "class-validator";

export class CreatePackageDto {
	@ApiProperty({
		description: "Package title (required)",
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
		// Adicionar ApiProperty
		description: "Package description is optional",
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
