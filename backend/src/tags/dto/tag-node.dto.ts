import { Expose } from "class-transformer";
import { IsString, IsUUID } from "class-validator";

import { CardDto } from "src/card/dto/card.dto";

export class TagNodeDto {
	@Expose()
	@IsUUID()
	id: string;

	@Expose()
	@IsString()
	name: string;

	@Expose()
	cards: SimpleCardDto[];

	@Expose()
	children: TagNodeDto[];
}

export class GetAllTagsDto {
	@Expose()
	tags: TagNodeDto[];
}

export class SimpleCardDto {
	@Expose()
	id: string;

	@Expose()
	title: string;

	@Expose()
	description: string;
}
