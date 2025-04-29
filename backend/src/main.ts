import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { setupSwagger } from "./config/swagger";
import { JwtAuthGuard } from "./config/guards.guard";
import { runSeed } from "../seed";
import { UsersService } from "./users/users.service";
import { BcryptAdapter } from "./common/adapter/bcrypt.adapter";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { excludeExtraneousValues: true },
		}),
	);

	setupSwagger(app);

	const usersService = app.get(UsersService);
	const bcryptAdapter = app.get(BcryptAdapter);
	const configService = app.get(ConfigService);
	await runSeed(usersService, bcryptAdapter, configService);

	const reflector = app.get(Reflector);
	app.useGlobalGuards(new JwtAuthGuard(reflector));

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
