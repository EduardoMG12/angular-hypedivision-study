import { IsString, IsNotEmpty, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CreateTermsOfUseDto {
	@ApiProperty({
		description: "Version of the terms of use / Versão dos termos de uso",
		type: String,
		example: "1.0.0",
	})
	@IsString({
		message: "A versão deve ser uma string / The version must be a string",
	})
	@IsNotEmpty({ message: "A versão é obrigatória / The version is required" })
	@Expose()
	version: string;

	@ApiProperty({
		description: "Content of the terms of use / Conteúdo dos termos de uso",
		type: String,
		example: "These are the terms of use for our platform...",
	})
	@IsString({
		message: "O conteúdo deve ser uma string / The content must be a string",
	})
	@IsNotEmpty({ message: "O conteúdo é obrigatório / The content is required" })
	@Expose()
	content: string;

	@ApiProperty({
		description:
			"Indicates if the terms are active / Indica se os termos estão ativos",
		type: Boolean,
		example: true,
		required: false,
	})
	@IsBoolean({
		message:
			"O status ativo deve ser um booleano / The active status must be a boolean",
	})
	@IsOptional()
	@Expose()
	isActive?: boolean;
}
