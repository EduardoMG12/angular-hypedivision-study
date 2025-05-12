import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core"; // Importe 'inject'
import { AuthService } from "../../services/auth-service/auth.service";

// Agora é uma função, não uma classe
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
	// Use 'inject' para obter instâncias de serviços em um contexto funcional
	const authService = inject(AuthService);
	const token = authService.getToken();

	if (token) {
		// Clone a requisição e adicione o cabeçalho de Autorização
		const clonedRequest = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		});
		return next(clonedRequest); // Passe a requisição modificada
	}

	return next(req); // Se não houver token, passe a requisição original
};
