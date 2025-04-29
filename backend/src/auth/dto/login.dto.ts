import { IsString, MinLength } from "class-validator";
import { BaseUser } from "./baseUser.dto";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto extends BaseUser {
	@ApiProperty({
		description:
			"User password (minimum 6 characters) / Senha do usuário (mínimo 6 caracteres)",
		type: String,
		example: "SecurePass123!",
	})
	@IsString({
		message: "A senha deve ser uma string / The password must be a string",
	})
	@MinLength(6, {
		message:
			"A senha deve ter pelo menos 6 caracteres / The password must have at least 6 characters",
	})
	@Expose()
	password: string;
}
