import { TermsOfUseModule } from "./terms-of-use/terms-of-use.module";
import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { AdminModule } from "./admin/admin.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: "postgres",
				host: process.env.DATABASE_HOST || "db",
				port: Number(process.env.DB_PORT) || 5432,
				username: process.env.DB_USERNAME || "user",
				password: process.env.DB_PASSWORD || "password",
				database: process.env.DB_DATABASE || "hype_study_division",
				entities: [`${__dirname}/**/*.entity{.ts,.js}`],
				migrations: [`${__dirname}/migrations/*{.ts,.js}`],
				synchronize: configService.get<boolean>("DB_SYNCHRONIZE", false),
			}),
			inject: [ConfigService],
		}),
		UsersModule,
		AuthModule,
		AdminModule,
		TermsOfUseModule,
	],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
