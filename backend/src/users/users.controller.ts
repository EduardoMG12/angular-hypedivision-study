import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { SafeUser } from "../auth/dto/safe-user.dto";
import { toPlainToInstance } from "../common/utils/to-plain-to-instance";
import { GetUserId } from "src/common/decorators/get-user-id.decorator";
import { IUsersController } from "./interfaces/IUsersController";

@ApiTags("Users")
@ApiBearerAuth("User")
@Controller("users")
export class UsersController implements IUsersController {
	constructor(private usersService: UsersService) {}

	@Get("me")
	@ApiOperation({
		summary:
			"Get authenticated user profile / Obter perfil do usuário autenticado",
		description: `
            **English**: 
            Retrieves the profile information of the currently authenticated user. The endpoint returns user details such as ID, full name, email, CPF/CNPJ, phone, birthdate, privilege, and creation timestamp, as defined in the SafeUser DTO. It requires a valid JWT token in the Authorization header, which is validated to extract the user ID. This endpoint is useful for users to view their own account information without exposing sensitive fields like passwords or deleted_at timestamps. The response is sanitized to ensure only non-sensitive data is returned.

            **Português**: 
            Recupera as informações de perfil do usuário atualmente autenticado. O endpoint retorna detalhes do usuário, como ID, nome completo, e-mail, CPF/CNPJ, telefone, data de nascimento, privilégio e carimbo de criação, conforme definido no SafeUser DTO. Requer um token JWT válido no cabeçalho Authorization, que é validado para extrair o ID do usuário. Este endpoint é útil para que os usuários visualizem as informações de sua própria conta sem expor campos sensíveis, como senhas ou carimbos de exclusão. A resposta é sanitizada para garantir que apenas dados não sensíveis sejam retornados.
        `,
	})
	@ApiResponse({
		status: 200,
		description: `
            **English**: 
            Successfully returned the authenticated user's profile data. The response includes non-sensitive fields like ID, full name, email, and privilege, as defined in the SafeUser DTO.

            **Português**: 
            Perfil do usuário autenticado retornado com sucesso. A resposta inclui campos não sensíveis como ID, nome completo, e-mail e privilégio, conforme definido no SafeUser DTO.
        `,
		type: SafeUser,
		examples: {
			success: {
				summary: "Successful response / Resposta bem-sucedida",
				value: {
					id: "123e4567-e89b-12d3-a456-426614174000",
					fullName: "João Silva",
					email: "joao.silva@example.com",
					phone: "(11) 98765-4321",
					birthdate: "1990-01-01",
					privilege: "USER",
					created_at: "2025-04-15T10:00:00Z",
				},
			},
		},
	})
	@ApiResponse({
		status: 401,
		description: `
            **English**: 
            Unauthorized request. This error occurs when:
            - No JWT token is provided in the Authorization header.
            - The provided token is invalid, expired, or malformed.
            - The token does not contain a valid user ID.

            **Português**: 
            Requisição não autorizada. Este erro ocorre quando:
            - Nenhum token JWT é fornecido no cabeçalho Authorization.
            - O token fornecido é inválido, expirado ou malformado.
            - O token não contém um ID de usuário válido.
        `,
		examples: {
			unauthorized: {
				summary: "Unauthorized error / Erro de não autorizado",
				value: {
					statusCode: 401,
					message: "Unauthorized",
				},
			},
		},
	})
	@ApiResponse({
		status: 404,
		description: `
            **English**: 
            User not found. This error occurs when the user ID extracted from the JWT token does not match any existing user in the database, possibly due to account deletion or an invalid token.

            **Português**: 
            Usuário não encontrado. Este erro ocorre quando o ID do usuário extraído do token JWT não corresponde a nenhum usuário existente no banco de dados, possivelmente devido à exclusão da conta ou a um token inválido.
        `,
		examples: {
			notFound: {
				summary: "User not found / Usuário não encontrado",
				value: {
					statusCode: 404,
					message: "Usuário não encontrado",
					error: "Not Found",
				},
			},
		},
	})
	async getProfile(@GetUserId() userId: string): Promise<SafeUser> {
		return toPlainToInstance(SafeUser, this.usersService.findById(userId));
	}
}
