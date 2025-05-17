import { Module } from "@nestjs/common";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";

import { CardContentFlip } from "../entities/card-content-flip.entity";

import { CardService } from "./card.service";

import { Repository } from "typeorm";

import { UsersModule } from "../users/users.module";
import { CardContentOrchestratorService } from "./content-create/card-content.orchestrator.service";
import { ContentCreatorRegistry } from "./content-create/content-creator.registry";
import { Card } from "src/entities/cards.entity";
import {
	AbstractContentCreator,
	CONTENT_CREATORS,
} from "./content-create/content-creator.interface";
import { FlipContentCreator } from "./content-create/flip-content.creator";
import { CardController } from "./card.controller";
import { CardTag } from "src/entities/card-tags.entity";
import { TagsModule } from "src/tags/tags.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([Card, CardContentFlip, CardTag]),
		TagsModule,
		UsersModule,
	],
	controllers: [CardController],
	providers: [
		CardService,
		CardContentOrchestratorService,
		ContentCreatorRegistry,
		{
			provide: CONTENT_CREATORS,
			useFactory: (
				flipContentRepo: Repository<CardContentFlip>,
			): AbstractContentCreator[] => {
				console.log("--- Inside useFactory for CONTENT_CREATORS ---");
				console.log("Received flipContentRepo:", flipContentRepo);
				console.log(
					"Is flipContentRepo a TypeORM Repository instance?",
					flipContentRepo instanceof Repository,
				);
				console.log("--- End useFactory logs ---");

				const creators: AbstractContentCreator[] = [
					new FlipContentCreator(flipContentRepo),
				];

				console.log(
					"[useFactory] Created array of creators:",
					creators.map((c) => c.constructor.name),
				);
				return creators;
			},
			inject: [getRepositoryToken(CardContentFlip)],
		},
	],
	exports: [
		CardService,
		CardContentOrchestratorService,
		ContentCreatorRegistry,
		CONTENT_CREATORS,
	],
})
export class CardModule {}
