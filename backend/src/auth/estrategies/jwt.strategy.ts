import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/users/users.service";
import { errorMessages } from "src/common/errors/errors-message";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private configService: ConfigService,
		private usersService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>("JWT_SECRET"),
		});
	}

	async validate(payload: { id: string; email: string; privilege: string }) {
		try {
			const user = await this.usersService.findById(payload.id);
			if (!user) {
				throw new UnauthorizedException(errorMessages.USER_NOT_FOUND["pt-BR"]);
			}

			if (user.email !== payload.email) {
				throw new UnauthorizedException(
					"Token payload does not match user data",
				);
			}

			return {
				id: user.id,
				email: user.email,
			};
		} catch (error) {
			if (error.name === "TypeORMError") {
				throw new UnauthorizedException(errorMessages.DATABASE_ERROR["pt-BR"]);
			}
			throw error;
		}
	}
}
