import { Module } from "@nestjs/common";
import { FlashcardService } from "./flashcard.service";
import { FlashcardController } from "./flashcard.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Flashcard } from "src/entities/flashcards.entity";
import { UsersModule } from "src/users/users.module";
import { PackageModule } from "src/package/package.module";

@Module({
	imports: [TypeOrmModule.forFeature([Flashcard]), UsersModule, PackageModule],
	providers: [FlashcardService],
	controllers: [FlashcardController],
	exports: [FlashcardService],
})
export class FlashcardModule {}
