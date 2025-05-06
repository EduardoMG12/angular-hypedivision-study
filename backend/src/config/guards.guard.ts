import {
	Injectable,
	UnauthorizedException,
	ExecutionContext,
	CanActivate,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { IS_PUBLIC_KEY } from "../common/decorators/public.decorator";
import { errorMessages } from "../common/errors/errors-message";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";

@Injectable()
@ApiBearerAuth()
@ApiUnauthorizedResponse({
	description:
		"Unauthorized: Missing, invalid, or expired token, or user not found.",
})
export class JwtAuthGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
		private readonly configService: ConfigService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.get<boolean>(
			IS_PUBLIC_KEY,
			context.getHandler(),
		);
		if (isPublic) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const authHeader = request.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new UnauthorizedException("Missing or invalid token");
		}

		const token = authHeader.split(" ")[1];

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get<string>("JWT_SECRET"),
			});

			const user = await this.usersService.findById(payload.id);
			if (!user) {
				throw new UnauthorizedException(errorMessages.USER_NOT_FOUND["pt-BR"]);
			}

			request.user = { id: payload.id, email: payload.email };

			return true;
		} catch (error) {
			throw new UnauthorizedException("Invalid or expired token");
		}
	}
}
