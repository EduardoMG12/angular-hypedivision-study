import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail } from "class-validator";

export class BaseUser {
	@ApiProperty({
		description: "User email address / Endereço de e-mail do usuário",
		type: String,
		example: "joao.silva@example.com",
	})
	@IsEmail(
		{},
		{ message: "O e-mail deve ser válido / The email must be valid" },
	)
	@Expose()
	email: string;
}
