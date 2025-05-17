import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeckCard } from "src/entities/deck-cards.entity";
import { DeckCardService } from "./deck-card.service";
import { DeckCardController } from "./deck-card.controller";
import { DeckModule } from "src/deck/deck.module";
import { CardModule } from "src/card/card.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([DeckCard]),
		forwardRef(() => DeckModule),
		CardModule,
	],
	providers: [DeckCardService],
	controllers: [DeckCardController],
	exports: [DeckCardService],
})
export class DeckCardModule {}
