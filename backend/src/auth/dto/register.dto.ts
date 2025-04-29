import { IsBoolean, IsDate, IsPhoneNumber, IsString } from "class-validator";
import { LoginDto } from "./login.dto";
import { Expose, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsCpfOrCnpj } from "src/common/decorators/is-cpf-cnpj.decorator";

export class RegisterDto extends LoginDto {
	@ApiProperty({
		description: "User full name / Nome completo do usuário",
		type: String,
		example: "João Silva",
	})
	@IsString({
		message: "O nome deve ser uma string / The name must be a string",
	})
	@Expose()
	fullName: string;

	@ApiProperty({
		description: "User birthdate / Data de nascimento do usuário",
		type: String,
		example: "1990-12-17",
	})
	@Transform(({ value }) => new Date(value))
	@Expose()
	@IsDate({
		message:
			"A data de nascimento deve ser válida / The birthdate must be valid",
	})
	birthdate: Date;

	@ApiProperty({
		description:
			"User phone number (Brazil format) / Número de telefone do usuário (formato Brasil)",
		type: String,
		example: "(11) 98765-4321",
	})
	@IsPhoneNumber("BR", {
		message:
			"O telefone deve ser válido no formato brasileiro / The phone number must be valid in Brazilian format",
	})
	@Expose()
	phone: string;

	@ApiProperty({
		description: "User CPF or CNPJ / CPF ou CNPJ do usuário",
		type: String,
		example: "123.456.789-01",
	})
	@IsCpfOrCnpj({
		message: "O CPF ou CNPJ deve ser válido / The CPF or CNPJ must be valid",
	})
	@Expose()
	cpfOrCnpj: string;

	@ApiProperty({
		description:
			"Indicates if the user accepts the terms of use / Indica se o usuário aceita os termos de uso",
		type: Boolean,
		example: true,
	})
	@IsBoolean({
		message:
			"A aceitação dos termos deve ser um booleano / The terms acceptance must be a boolean",
	})
	@Expose()
	accept_terms: boolean;
}
