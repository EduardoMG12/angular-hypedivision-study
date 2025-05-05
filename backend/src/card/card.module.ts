import { Module } from "@nestjs/common";
import { CardController } from "./card.controller";
import { CardService } from "./card.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cards } from "src/entities/cards.entity";
import { UsersModule } from "src/users/users.module";
import { FlashcardModule } from "src/flashcard/flashcard.module";

@Module({
	imports: [TypeOrmModule.forFeature([Cards]), UsersModule, FlashcardModule],
	controllers: [CardController],
	providers: [CardService],
	exports: [CardService],
})
export class CardModule {}
