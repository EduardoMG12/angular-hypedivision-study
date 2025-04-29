import { toPlainToInstance } from "src/common/utils/toPlainToInstance";
import { Controller, Post, Body } from "@nestjs/common";
import { UserTermsAcceptanceService } from "./user-terms-acceptance.service";
import { AcceptTermsDto } from "./dto/accept-terms.dto";
import { UserTermsAcceptance } from "src/entities/userTermsAcceptance.entity";
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBody,
	ApiBearerAuth,
} from "@nestjs/swagger";

@ApiTags("Terms of Use Acceptance / Aceitação de Termos de Uso")
@ApiBearerAuth("User")
@Controller("terms-of-use/accept")
export class UserTermsAcceptanceController {
	constructor(
		private readonly userTermsAcceptanceService: UserTermsAcceptanceService,
	) {}

	@ApiOperation({
		summary: "Accept terms of use / Aceitar termos de uso",
		description:
			"Allows a user to accept a specific version of the terms of use by providing the terms ID and user ID. / Permite que um usuário aceite uma versão específica dos termos de uso fornecendo o ID dos termos e o ID do usuário.",
	})
	@ApiBody({ type: AcceptTermsDto })
	@ApiResponse({
		status: 201,
		description: "Terms accepted successfully / Termos aceitos com sucesso",
		type: UserTermsAcceptance,
		example: {
			id: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
			termsOfUseId: "550e8400-e29b-41d4-a716-446655440000",
			userId: "123e4567-e89b-12d3-a456-426614174000",
			acceptedAt: "2025-04-15T10:00:00Z",
		},
	})
	@ApiResponse({
		status: 400,
		description:
			"Invalid input data (e.g., missing termsOfUseId or userId) / Dados de entrada inválidos (ex.: termsOfUseId ou userId ausentes)",
		example: {
			message: [
				"O ID dos termos é obrigatório / The terms ID is required",
				"O ID do usuário é obrigatório / The user ID is required",
			],
			error: "Bad Request",
			statusCode: 400,
		},
	})
	@ApiResponse({
		status: 404,
		description:
			"Terms of use or user not found / Termos de uso ou usuário não encontrados",
		example: {
			message: "Termos de uso não encontrados / Terms of use not found",
			error: "Not Found",
			statusCode: 404,
		},
	})
	@Post()
	async acceptTerms(@Body() dto: AcceptTermsDto): Promise<UserTermsAcceptance> {
		return toPlainToInstance(
			UserTermsAcceptance,
			this.userTermsAcceptanceService.acceptTerms(dto),
		);
	}
}
