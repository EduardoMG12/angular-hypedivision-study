import { Expose } from "class-transformer";
import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { DeckStatus } from "../common/enums/deck-status.enum";

export class DeckDto {
	@IsUUID()
	@Expose()
	@ApiProperty({
		type: String,
		format: "uuid",
		description: "The unique identifier of the deck",
		example: "b09ed3bf-355e-480b-9722-21ee99206eb8",
	})
	id: string;

	@Expose()
	@ApiProperty({
		type: String,
		description: "The title of the deck",
		example: "English Grammar",
	})
	title: string;

	@Expose()
	@ApiProperty({
		type: String,
		description: "The description of the deck",
		example: "A deck for practicing English grammar concepts",
		nullable: true,
	})
	description: string;

	@Expose()
	@ApiProperty({
		type: String,
		enum: DeckStatus,
		description: "The status of the deck (e.g., Active, Inactive)",
		example: DeckStatus.Active,
	})
	status: DeckStatus;

	@IsUUID()
	@Expose()
	@ApiProperty({
		type: String,
		format: "uuid",
		description: "The ID of the user who owns the deck",
		example: "cf1c31a5-8700-4856-b8e7-825f34fb471d",
	})
	ownerId: string;

	@IsUUID()
	@Expose()
	@ApiProperty({
		type: String,
		format: "uuid",
		description: "The ID of the group deck associated with this deck, if any",
		example: "0a172ec9-0df9-4fc8-a4ec-131207fe5831",
		nullable: true,
	})
	groupDecksId: string | null;

	@Expose()
	@ApiProperty({
		type: String,
		format: "date-time",
		description: "The date and time when the deck was created",
		example: "2025-05-17T10:31:00.000Z",
	})
	createdAt: Date;

	@Expose()
	@ApiProperty({
		type: String,
		format: "date-time",
		description: "The date and time when the deck was last updated",
		example: "2025-05-17T10:31:00.000Z",
	})
	updatedAt: Date;
}
