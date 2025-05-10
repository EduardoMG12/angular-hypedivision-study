import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tag } from "src/entities/tags.entity";

import { Card } from "src/entities/cards.entity";
import { TagService } from "./tags.service";
import { TagsController } from "./tags.controller";
import { CardTag } from "src/entities/cardTags.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Tag, CardTag, Card])],
	providers: [TagService],
	controllers: [TagsController],
	exports: [TagService],
})
export class TagsModule {}
