import { toPlainToInstance } from "src/common/utils/toPlainToInstance";
import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { TermsOfUseService } from "./terms-of-use.service";
import { CreateTermsOfUseDto } from "./dto/create-terms-of-use.dto";
import { TermsOfUse } from "src/entities/termsOfUse.entity";
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBody,
	ApiParam,
	ApiBearerAuth,
} from "@nestjs/swagger";
import { AcceptTermsDto } from "./dto/accept-terms.dto";
import { UserTermsAcceptance } from "src/entities/userTermsAcceptance.entity";

@ApiTags("Terms of Use / Termos de Uso")
@Controller("terms-of-use")
export class TermsOfUseController {
	constructor(private readonly termsOfUseService: TermsOfUseService) {}

	@ApiOperation({
		summary: "Get active terms of use / Obter termos de uso ativos",
		description:
			"Retrieves the currently active terms of use. / Recupera os termos de uso atualmente ativos.",
	})
	@ApiResponse({
		status: 200,
		description:
			"Active terms retrieved successfully / Termos ativos recuperados com sucesso",
		type: TermsOfUse,
		example: {
			id: "550e8400-e29b-41d4-a716-446655440000",
			version: "1.0.0",
			content: "These are the terms of use for our platform...",
			isActive: true,
			isCreditExclusive: false,
			createdAt: "2025-04-15T10:00:00Z",
		},
	})
	@ApiResponse({
		status: 404,
		description: "No active terms found / Nenhum termo ativo encontrado",
		example: {
			message:
				"Nenhum termo de uso ativo encontrado / No active terms of use found",
			error: "Not Found",
			statusCode: 404,
		},
	})
	@ApiBearerAuth("User")
	@Get("active")
	async getActiveTerms(): Promise<TermsOfUse> {
		return toPlainToInstance(TermsOfUse, this.termsOfUseService.findActive());
	}

	@ApiOperation({
		summary: "Get terms of use by ID / Obter termos de uso por ID",
		description:
			"Retrieves a specific terms of use by its ID. / Recupera um termo de uso específico pelo seu ID.",
	})
	@ApiParam({
		name: "id",
		description: "ID of the terms of use / ID dos termos de uso",
		type: String,
		example: "550e8400-e29b-41d4-a716-446655440000",
	})
	@ApiResponse({
		status: 200,
		description:
			"Terms retrieved successfully / Termos recuperados com sucesso",
		type: TermsOfUse,
		example: {
			id: "550e8400-e29b-41d4-a716-446655440000",
			version: "1.0.0",
			content: "These are the terms of use for our platform...",
			isActive: true,
			isCreditExclusive: false,
			createdAt: "2025-04-15T10:00:00Z",
		},
	})
	@ApiResponse({
		status: 404,
		description: "Terms not found / Termos não encontrados",
		example: {
			message: "Termos de uso não encontrados / Terms of use not found",
			error: "Not Found",
			statusCode: 404,
		},
	})
	@ApiBearerAuth("User")
	@Get(":id")
	async getTermsById(@Param("id") id: string): Promise<TermsOfUse> {
		return toPlainToInstance(TermsOfUse, this.termsOfUseService.findById(id));
	}

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
			this.termsOfUseService.acceptTerms(dto),
		);
	}
}
