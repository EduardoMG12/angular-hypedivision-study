import { Module } from "@nestjs/common";
import { DeckService } from "./deck.service";
import { DeckController } from "./deck.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { PackageModule } from "src/package/package.module";
import { Deck } from "src/entities/decks.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Deck]), UsersModule, PackageModule],
	providers: [DeckService],
	controllers: [DeckController],
	exports: [DeckService],
})
export class DeckModule {}
