import { GetUserId } from "../common/decorators/get-user-id.decorator";
import { SafeUserWithJwt } from "./dto/safe-user-with-jwt.dto";
import {
	Controller,
	Post,
	Body,
	Get,
	UnauthorizedException,
	Headers,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { Public } from "../common/decorators/public.decorator";
import { toPlainToInstance } from "../common/utils/to-plain-to-instance";
import { AccessToken } from "./dto/access-token.dto";
import {
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiBody,
	ApiBearerAuth,
	ApiHeader,
} from "@nestjs/swagger";
import { ValidateTokenDto } from "./dto/validate-token.dto";
import { UserTermsAcceptance } from "src/entities/user-terms-acceptance.entity";
import { AcceptTermsDto } from "./dto/user-terms-acceptance.dto";

// TODO: Implement rate limiting with @nestjs/throttler to limit requests (e.g., 100 requests per 15 minutes)
// read about @SerializeOptionsType for returns controller include plainToInstance global for Exclude and Expose
// find a way for limit requests mount

@ApiTags("Auth / Autenticação")
@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@Post("register")
	@ApiOperation({
		summary: "Register a new user / Registrar um novo usuário",
		description:
			"Creates a new user account with the provided details and returns user data with a JWT token. / Cria uma nova conta de usuário com os detalhes fornecidos e retorna os dados do usuário com um token JWT.",
	})
	@ApiBody({ type: RegisterDto })
	@ApiResponse({
		status: 201,
		description:
			"User successfully registered / Usuário registrado com sucesso",
		type: SafeUserWithJwt,
		example: {
			id: "123e4567-e89b-12d3-a456-426614174000",
			fullName: "João Silva",
			email: "joao.silva@example.com",
			birthdate: "1990-12-17",
			phone: "(11) 98765-4321",
			created_at: "2025-04-15T10:00:00Z",
			access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
		},
	})
	@ApiResponse({
		status: 400,
		description:
			"Invalid input data (e.g., invalid email, missing fields) / Dados de entrada inválidos (ex.: e-mail inválido, campos ausentes)",
		example: {
			message: [
				"O e-mail deve ser válido / The email must be valid",
				"O CPF ou CNPJ deve ser válido / The CPF or CNPJ must be valid",
			],
			error: "Bad Request",
			statusCode: 400,
		},
	})
	@ApiResponse({
		status: 409,
		description:
			"Conflict (e.g., email or CPF/CNPJ already exists) / Conflito (ex.: e-mail ou CPF/CNPJ já existe)",
		example: {
			message: "E-mail já registrado / Email already registered",
			error: "Conflict",
			statusCode: 409,
		},
	})
	async register(@Body() registerDto: RegisterDto): Promise<SafeUserWithJwt> {
		return toPlainToInstance(
			SafeUserWithJwt,
			await this.authService.register(registerDto),
		);
	}

	@Public()
	@Post("login")
	@ApiOperation({
		summary:
			"Authenticate user and obtain JWT token / Autenticar usuário e obter token JWT",
		description:
			"Authenticates a user with email and password, returning a JWT token. / Autentica um usuário com e-mail e senha, retornando um token JWT.",
	})
	@ApiBody({ type: LoginDto })
	@ApiResponse({
		status: 200,
		description: "Successful login / Login bem-sucedido",
		type: AccessToken,
		example: {
			access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
		},
	})
	@ApiResponse({
		status: 401,
		description:
			"Invalid credentials (e.g., wrong email or password) / Credenciais inválidas (ex.: e-mail ou senha incorretos)",
		example: {
			message: "Credenciais inválidas / Invalid credentials",
			error: "Unauthorized",
			statusCode: 401,
		},
	})
	@ApiResponse({
		status: 400,
		description:
			"Invalid input data (e.g., missing email) / Dados de entrada inválidos (ex.: e-mail ausente)",
		example: {
			message: ["O e-mail deve ser válido / The email must be valid"],
			error: "Bad Request",
			statusCode: 400,
		},
	})
	async login(@Body() loginDto: LoginDto): Promise<AccessToken> {
		return toPlainToInstance(
			AccessToken,
			await this.authService.login(loginDto),
		);
	}

	@Get("validate-token")
	@ApiOperation({
		summary: "Validate JWT token / Validar token JWT",
		description:
			"Verifies if a JWT token is valid and not expired. / Verifica se um token JWT é válido e não expirado.",
	})
	@ApiHeader({
		name: "authorization",
		description:
			"Bearer token for authentication / Token Bearer para autenticação",
		example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	})
	@ApiResponse({
		status: 200,
		description: "Token is valid / Token é válido",
		type: ValidateTokenDto,
		example: {
			accessToken: true,
		},
	})
	@ApiResponse({
		status: 401,
		description: "Token is invalid or expired / Token é inválido ou expirado",
		example: {
			message: "Token inválido ou expirado / Token is invalid or expired",
			error: "Unauthorized",
			statusCode: 401,
		},
	})
	@ApiBearerAuth()
	async validateToken(
		@Headers("authorization") authHeader: string,
	): Promise<ValidateTokenDto> {
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new UnauthorizedException("Token inválido / Invalid token");
		}

		const token = authHeader.split(" ")[1];
		try {
			return toPlainToInstance(
				ValidateTokenDto,
				await this.authService.validateToken(token),
			);
		} catch (error) {
			throw new UnauthorizedException(
				"Token inválido ou expirado / Token is invalid or expired",
			);
		}
	}

	@Post("accept-terms")
	@ApiOperation({
		summary:
			"Accept terms of use for the authenticated user / Aceitar termos de uso para o usuário autenticado",
		description:
			"Allows an authenticated user to accept a specific version of the terms of use. / Permite que um usuário autenticado aceite uma versão específica dos termos de uso.",
	})
	@ApiBody({ type: AcceptTermsDto })
	@ApiResponse({
		status: 201,
		description: "Terms successfully accepted / Termos aceitos com sucesso",
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
		description: "Invalid terms of use ID / ID dos termos de uso inválido",
		example: {
			message: "O ID dos termos é obrigatório / The terms ID is required",
			error: "Bad Request",
			statusCode: 400,
		},
	})
	@ApiResponse({
		status: 401,
		description:
			"Unauthorized (invalid or missing JWT token) / Não autorizado (token JWT inválido ou ausente)",
		example: {
			message: "Não autorizado / Unauthorized",
			error: "Unauthorized",
			statusCode: 401,
		},
	})
	@ApiResponse({
		status: 404,
		description: "Terms of use not found / Termos de uso não encontrados",
		example: {
			message: "Termos de uso não encontrados / Terms of use not found",
			error: "Not Found",
			statusCode: 404,
		},
	})
	@ApiBearerAuth()
	async acceptTerms(
		@Body() acceptTermsDto: AcceptTermsDto,
		@GetUserId() userId: string,
	): Promise<UserTermsAcceptance> {
		return toPlainToInstance(
			UserTermsAcceptance,
			await this.authService.acceptTerms(acceptTermsDto, userId),
		);
	}
}
