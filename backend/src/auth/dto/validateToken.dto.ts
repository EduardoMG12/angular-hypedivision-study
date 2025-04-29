import { ApiProperty } from "@nestjs/swagger";

export class ValidateTokenDto {
	@ApiProperty({
		description:
			"Indicates if the access token is valid / Indica se o token de acesso é válido",
		type: Boolean,
		example: true,
	})
	accessToken: boolean;
}
