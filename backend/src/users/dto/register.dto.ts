import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
	@ApiProperty({
		description: "Full name of the user / Nome completo do usuário",
		type: String,
		example: "João Silva",
	})
	@IsString({
		message: "O nome deve ser uma string / The name must be a string",
	})
	@Expose()
	name: string;

	@ApiProperty({
		description: "Email address of the user / Endereço de e-mail do usuário",
		type: String,
		example: "joao@example.com",
	})
	@IsEmail(
		{},
		{ message: "O e-mail deve ser válido / The email must be valid" },
	)
	@Expose()
	email: string;

	@ApiProperty({
		description:
			"Password for the user account / Senha para a conta do usuário",
		type: String,
		example: "securePassword123",
		minLength: 6,
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
