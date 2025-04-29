import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./estrategies/jwt.strategy";
import { BcryptAdapter } from "src/common/adapter/bcrypt.adapter";
import { IsCpfOrCnpjConstraint } from "src/common/validator/is-cpf-cnpj.validator";
import { TermsOfUseModule } from "src/terms-of-use/terms-of-use.module";

@Module({
	imports: [
		ConfigModule,
		UsersModule,
		PassportModule,
		TermsOfUseModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const secret = configService.get<string>("JWT_SECRET");
				if (!secret) {
					throw new Error("JWT_SECRET not defined on .env");
				}
				return {
					secret,
					signOptions: { expiresIn: "15d" },
				};
			},
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, BcryptAdapter, IsCpfOrCnpjConstraint],
	exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
