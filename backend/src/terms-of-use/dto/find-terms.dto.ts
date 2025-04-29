import { Expose } from "class-transformer";
import { IsString, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FindTermsDto {
	@ApiProperty({
		description:
			"Version of the terms to filter / Versão dos termos para filtrar",
		type: String,
		example: "1.0.0",
		required: false,
	})
	@IsString({
		message: "A versão deve ser uma string / The version must be a string",
	})
	@IsOptional()
	@Expose()
	version?: string;

	@ApiProperty({
		description:
			"Filter terms by active status / Filtrar termos por status ativo",
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
