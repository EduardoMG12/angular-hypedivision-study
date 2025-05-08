import { Body, Controller, Get, Post } from "@nestjs/common";
import { Admin } from "src/common/decorators/admin.decorator";
import { GetUserId } from "src/common/decorators/getUserId.decorator";
import { AdminService } from "./admin.service";
import { toPlainToInstance } from "src/common/utils/toPlainToInstance";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateTermsOfUseDto } from "src/terms-of-use/dto/create-terms-of-use.dto";
import { TermsOfUse } from "src/entities/termsOfUse.entity";

@Controller("admin")
export class AdminController {
	constructor(private adminService: AdminService) {}

	@Get("users")
	@ApiOperation({
		summary: "List all users / Listar todos os usuários",
		description: `
		  **English**: Retrieves a list of all registered users. Only accessible by admins.
		  **Português**: Recupera uma lista de todos os usuários registrados. Acessível apenas por administradores.
		`,
	})
	getUsersList(@GetUserId() userId: string) {
		return { message: "Lista de todos os usuários" };
	}

	@Get("test")
	@ApiOperation({
		summary: "Test admin endpoint / Testar endpoint de admin",
		description: `
      **English**: Test endpoint for admin functionalities.
      **Português**: Endpoint de teste para funcionalidades de administrador.
    `,
	})
	async test() {
		this.adminService.test();
	}

	@Admin()
	@Post("terms-of-use")
	@ApiOperation({
		summary: "Create new terms of use / Criar novos termos de uso",
		description: `
      **English**: Creates a new terms of use entry, accessible only by admins. Terms can be common (applicable to all users) or exclusive to users with credit accounts (\`isCreditExclusive: true\`). If marked as active (\`isActive: true\`), other active terms of the same type are deactivated to ensure only one active set of terms per type. The version must be unique for the given type.

      **Português**: Cria uma nova entrada de termos de uso, acessível apenas por administradores. Os termos podem ser comuns (aplicáveis a todos os usuários) ou exclusivos para usuários com crediário (\`isCreditExclusive: true\`). Se marcados como ativos (\`isActive: true\`), outros termos ativos do mesmo tipo são desativados para garantir apenas um conjunto de termos ativo por tipo. A versão deve ser única para o tipo especificado.
    `,
	})
	@ApiBody({
		type: CreateTermsOfUseDto,
		description: `
      **English**: The data required to create terms of use, including version, content, and optional fields for active status and credit exclusivity.
      **Português**: Os dados necessários para criar termos de uso, incluindo versão, conteúdo e campos opcionais para status ativo e exclusividade para crediário.
    `,
		examples: {
			commonTerms: {
				summary: "Common Terms / Termos Comuns",
				description:
					"Example of creating terms for all users / Exemplo de criação de termos para todos os usuários",
				value: {
					version: "1.0",
					content: "Estes são os termos gerais aplicáveis a todos os usuários.",
					isActive: true,
					isCreditExclusive: false,
				},
			},
			creditTerms: {
				summary: "Credit-Exclusive Terms / Termos Exclusivos para Crediário",
				description:
					"Example of creating terms for credit users only / Exemplo de criação de termos apenas para usuários com crediário",
				value: {
					version: "1.0",
					content:
						"Estes termos se aplicam a usuários com contas de crediário.",
					isActive: true,
					isCreditExclusive: true,
				},
			},
		},
	})
	@ApiResponse({
		status: 201,
		description: `
      **English**: Terms of use created successfully. Returns the created terms with their ID, version, content, active status, and credit exclusivity flag.
      **Português**: Termos de uso criados com sucesso. Retorna os termos criados com seu ID, versão, conteúdo, status ativo e sinalizador de exclusividade para crediário.
    `,
		type: TermsOfUse,
	})
	@ApiResponse({
		status: 400,
		description: `
      **English**: Bad request. Possible reasons include:
        - Missing required fields (\`version\` or \`content\`).
        - Version already exists for the specified type (\`isCreditExclusive\`).
      **Português**: Requisição inválida. Possíveis motivos incluem:
        - Campos obrigatórios ausentes (\`version\` ou \`content\`).
        - Versão já existe para o tipo especificado (\`isCreditExclusive\`).
    `,
	})
	@ApiResponse({
		status: 401,
		description: `
      **English**: Unauthorized. User is not authenticated or lacks admin privileges.
      **Português**: Não autorizado. Usuário não está autenticado ou não possui privilégios de administrador.
    `,
	})
	@ApiResponse({
		status: 403,
		description: `
      **English**: Forbidden. User does not have admin privileges.
      **Português**: Proibido. Usuário não possui privilégios de administrador.
    `,
	})
	async createTermsOfUse(
		@Body() dto: CreateTermsOfUseDto,
	): Promise<TermsOfUse> {
		return toPlainToInstance(
			TermsOfUse,
			await this.adminService.createTermsOfUse(dto),
		);
	}

	async registerWithCredit(): Promise<void> {}
}
