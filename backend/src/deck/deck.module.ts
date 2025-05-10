import { forwardRef, Module } from "@nestjs/common";
import { DeckService } from "./deck.service";
import { DeckController } from "./deck.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { GroupDecksModule } from "src/group-decks/group-decks.module";
import { Deck } from "src/entities/decks.entity";
import { DeckCardModule } from "src/deck-card/deck-card.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([Deck]),
		UsersModule,
		GroupDecksModule,
		forwardRef(() => DeckCardModule),
	],
	providers: [DeckService],
	controllers: [DeckController],
	exports: [DeckService],
})
export class DeckModule {}
