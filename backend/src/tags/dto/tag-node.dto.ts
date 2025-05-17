import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsUUID, IsString } from "class-validator";

export class SimpleCardDto {
	@Expose()
	@ApiProperty({
		type: String,
		format: "uuid",
		description: "The unique identifier of the card",
		example: "013aab30-e740-482b-9b98-c3f09607ba3f",
		required: true,
	})
	id: string;

	@Expose()
	@ApiProperty({
		type: String,
		description: "The title of the card",
		example: "English Grammar: Present Perfect",
		required: true,
	})
	title: string;

	@Expose()
	@ApiProperty({
		type: String,
		description: "The description of the card, if any",
		example: null,
		required: true,
		nullable: true,
	})
	description: string;
}

export class TagNodeDto {
	@Expose()
	@IsUUID()
	@ApiProperty({
		type: String,
		format: "uuid",
		description: "The unique identifier of the tag",
		example: "27c58d88-ee35-4eac-a78a-b6d71d709dc0",
		required: true,
	})
	id: string;

	@Expose()
	@IsString()
	@ApiProperty({
		type: String,
		description: "The name of the tag",
		example: "gramatica",
		required: true,
	})
	name: string;

	@Expose()
	@ApiProperty({
		type: [SimpleCardDto],
		description: "The list of cards directly associated with this tag",
		example: [
			{
				id: "013aab30-e740-482b-9b98-c3f09607ba3f",
				title: "English Grammar: Present Perfect",
				description: null,
			},
		],
		required: true,
	})
	cards: SimpleCardDto[];

	@Expose()
	@ApiProperty({
		type: () => [TagNodeDto],
		description: "The list of child tags under this tag",
		example: [
			{
				id: "0a172ec9-0df9-4fc8-a4ec-131207fe5831",
				name: "tenses",
				cards: [],
				children: [],
				childrenCardsCount: 0,
			},
		],
		required: true,
	})
	children: TagNodeDto[];

	@Expose()
	@ApiProperty({
		type: Number,
		description: "The total number of cards in this tag and its descendants",
		example: 1,
		required: true,
	})
	childrenCardsCount: number;
}

export class GetAllTagsDto {
	@Expose()
	@ApiProperty({
		type: [TagNodeDto],
		description:
			"The list of root tags with their associated cards and child tags",
		example: [
			{
				id: "27c58d88-ee35-4eac-a78a-b6d71d709dc0",
				name: "gramatica",
				cards: [
					{
						id: "013aab30-e740-482b-9b98-c3f09607ba3f",
						title: "English Grammar: Present Perfect",
						description: null,
					},
				],
				children: [
					{
						id: "0a172ec9-0df9-4fc8-a4ec-131207fe5831",
						name: "tenses",
						cards: [],
						children: [],
						childrenCardsCount: 0,
					},
				],
				childrenCardsCount: 1,
			},
		],
		required: true,
	})
	tags: TagNodeDto[];
}
