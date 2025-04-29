import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import type { INestApplication } from "@nestjs/common";

export function setupSwagger(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle("Market app show credit")
		.setDescription(
			"API documentation for developer authentication and management.",
		)
		.setVersion("1.0")
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api/docs", app, document);
}
