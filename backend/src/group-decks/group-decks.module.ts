import { Module } from "@nestjs/common";
import { GroupDecksService } from "./group-decks.service";
import { GroupDecksController } from "./group-decks.controller";
import { GroupDecks } from "src/entities/group_decks.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";

@Module({
	imports: [TypeOrmModule.forFeature([GroupDecks]), UsersModule],
	providers: [GroupDecksService],
	controllers: [GroupDecksController],
	exports: [GroupDecksService],
})
export class GroupDecksModule {}
