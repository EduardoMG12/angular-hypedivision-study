import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class AcceptTermsDto {
	@ApiProperty({
		description:
			"ID of the terms of use to accept / ID dos termos de uso a aceitar",
		type: String,
		example: "550e8400-e29b-41d4-a716-446655440000",
	})
	@IsString({
		message:
			"O ID dos termos deve ser uma string / The terms ID must be a string",
	})
	@IsNotEmpty({
		message: "O ID dos termos é obrigatório / The terms ID is required",
	})
	@Expose()
	termsOfUseId: string;
}
