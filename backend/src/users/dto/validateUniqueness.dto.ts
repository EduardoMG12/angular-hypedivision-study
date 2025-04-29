import { Expose } from "class-transformer";
import { IsEmail, IsPhoneNumber } from "class-validator";
import { IsCpfOrCnpj } from "src/common/decorators/is-cpf-cnpj.decorator";
import { ApiProperty } from "@nestjs/swagger";

export class ValidateUniquenessDto {
	@ApiProperty({
		description:
			"Email address to check for uniqueness / Endereço de e-mail para verificar unicidade",
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
			"CPF or CNPJ to check for uniqueness / CPF ou CNPJ para verificar unicidade",
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
			"Phone number to check for uniqueness (Brazil format) / Número de telefone para verificar unicidade (formato Brasil)",
		type: String,
		example: "(11) 98765-4321",
	})
	@IsPhoneNumber("BR", {
		message:
			"O telefone deve ser válido no formato brasileiro / The phone number must be valid in Brazilian format",
	})
	@Expose()
	phone: string;
}
