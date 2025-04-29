import { IsString, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTermsOfUseDto {
	@ApiProperty({
		description: "Updated version of the terms / Versão atualizada dos termos",
		type: String,
		example: "1.0.1",
		required: false,
	})
	@IsString({
		message: "A versão deve ser uma string / The version must be a string",
	})
	@IsOptional()
	version?: string;

	@ApiProperty({
		description:
			"Updated content of the terms / Conteúdo atualizado dos termos",
		type: String,
		example: "Updated terms of use content...",
		required: false,
	})
	@IsString({
		message: "O conteúdo deve ser uma string / The content must be a string",
	})
	@IsOptional()
	content?: string;

	@ApiProperty({
		description:
			"Updated active status of the terms / Status ativo atualizado dos termos",
		type: Boolean,
		example: false,
		required: false,
	})
	@IsBoolean({
		message:
			"O status ativo deve ser um booleano / The active status must be a boolean",
	})
	@IsOptional()
	isActive?: boolean;
}
