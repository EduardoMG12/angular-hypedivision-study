import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class SafeUser {
	@ApiProperty({
		description:
			"Unique identifier of the user / Identificador único do usuário",
		type: String,
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@Expose()
	id: string;

	@ApiProperty({
		description: "User full name / Nome completo do usuário",
		type: String,
		example: "João Silva",
	})
	@Expose()
	fullName: string;

	@ApiProperty({
		description: "User email address / Endereço de e-mail do usuário",
		type: String,
		example: "joao.silva@example.com",
	})
	@Expose()
	email: string;

	@ApiProperty({
		description: "User birthdate / Data de nascimento do usuário",
		type: String,
		example: "1990-12-17",
	})
	@Expose()
	birthdate: Date;

	@ApiProperty({
		description: "User phone number / Número de telefone do usuário",
		type: String,
		example: "(11) 98765-4321",
	})
	@Expose()
	phone: string;

	@ApiProperty({
		description: "User creation timestamp / Data de criação do usuário",
		type: String,
		example: "2025-04-15T10:00:00Z",
	})
	@Expose()
	created_at: Date;
}
