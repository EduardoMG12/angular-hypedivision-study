import { ErrorCode } from "./error-codes.enum";

export const errorMessages = {
	[ErrorCode.DECK_NOT_FOUND]: {
		"pt-BR": "O baralho nao existe.",
		"en-US": "The deck not foun.",
	},
	[ErrorCode.INVALID_INPUT]: {
		"pt-BR": "A entrada de dados é invalida.",
		"en-US": "The input of data is not valid.",
	},
	[ErrorCode.INVALID_CREDENTIALS]: {
		"pt-BR": "Credenciais inválidas. Por favor, verifique seu e-mail e senha.",
		"en-US": "Invalid credentials. Please check your email and password.",
	},
	[ErrorCode.USER_NOT_FOUND]: {
		"pt-BR": "Usuário não encontrado.",
		"en-US": "User not found.",
	},
	[ErrorCode.EMAIL_ALREADY_EXISTS]: {
		"pt-BR": "Este endereço de e-mail já está cadastrado.",
		"en-US": "This email address is already registered.",
	},
	[ErrorCode.DATABASE_ERROR]: {
		"pt-BR":
			"Ocorreu um erro ao acessar o banco de dados. Por favor, tente novamente mais tarde.",
		"en-US":
			"An error occurred while accessing the database. Please try again later.",
	},
	[ErrorCode.MISSING_ACCEPT_TERMS]: {
		"pt-BR": "É necessário aceitar os termos de uso.",
		"en-US": "Missing accept termsOfUse.",
	},
	[ErrorCode.INVALID_TOKEN]: {
		"pt-BR": "Token inválido.",
		"en-US": "Invalid token.",
	},
	[ErrorCode.TOKEN_EXPIRED]: {
		"pt-BR": "Token inválido ou expirado.",
		"en-US": "Invalid or expired token.",
	},
	[ErrorCode.INVALID_TERMS_ID]: {
		"pt-BR": "ID dos termos de uso inválido.",
		"en-US": "Invalid terms of use ID.",
	},
	[ErrorCode.USER_ALREADY_ACCEPTED_TERMS]: {
		"pt-BR": "Usuário já aceitou estes termos.",
		"en-US": "User has already accepted these terms.",
	},
	[ErrorCode.LOGIN_FAILED]: {
		"pt-BR": "Falha no login",
		"en-US": "Login failed",
	},
	[ErrorCode.UNAUTHORIZED_PERMISSION]: {
		"pt-BR": "O usuário não possui essa permissão.",
		"en-US": "The user does not have this permission.",
	},
	[ErrorCode.VERSION_ALREDY_EXIST]: {
		"pt-BR": "A versão já existe.",
		"en-US": "Version alredy exist.",
	},
	[ErrorCode.NO_ACTIVE_TERMS_FOUND]: {
		"pt-BR": "Nenhum termo de uso ativo encontrado.",
		"en-US": "No active terms of use found.",
	},
	[ErrorCode.CPF_OR_CNPJ_ALREADY_EXISTS]: {
		"pt-BR": "O cpf ou cnpj ja existe.",
		"en-US": "The cpf or cpnj alredy exist.",
	},
	[ErrorCode.PHONE_NUMBER_ALREADY_EXISTS]: {
		"pt-BR": "O numero de telefone ja existe",
		"en-US": "The phone number alredy exist",
	},
	[ErrorCode.TERMS_NOT_FOUND]: {
		"pt-BR": "Termos de uso nao encontrado",
		"en-US": "Terms of use not found",
	},
};
