import { Module } from "@nestjs/common";
import { CardController } from "./card.controller";
import { CardService } from "./card.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cards } from "src/entities/cards.entity";
import { UsersModule } from "src/users/users.module";
import { DeckModule } from "src/deck/deck.module";

@Module({
	imports: [TypeOrmModule.forFeature([Cards]), UsersModule, DeckModule],
	controllers: [CardController],
	providers: [CardService],
	exports: [CardService],
})
export class CardModule {}
