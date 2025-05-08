import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import {
	IsUUID,
	IsNotEmpty,
	MaxLength,
	IsOptional,
	IsString,
	IsEnum,
} from "class-validator";
import { GroupDecksStatus } from "../common/enums/group-decksStatus.enum";

export class UpdateGroupDecksDto {
	@ApiProperty({
		description: "Unic ID of GroupDecks to find what GroupDecks be updated",
		example: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
		format: "uuid",
	})
	@Expose()
	@IsUUID()
	@IsNotEmpty()
	id: string;

	@ApiProperty({
		description: "New title of group-decks (optional)",
		example: "Update title",
		maxLength: 100,
		required: false,
	})
	@MaxLength(100)
	@IsOptional()
	@IsString()
	@Expose()
	title?: string;

	@ApiProperty({
		description: "New description of group-decks do Pacote (optional)",
		example: "Descrição revisada.",
		maxLength: 1000,
		required: false,
		nullable: true,
	})
	@MaxLength(1000)
	@IsOptional()
	@IsString()
	@Expose()
	description?: string;

	@ApiProperty({
		description: "New status of GroupDecks (optional)",
		enum: GroupDecksStatus,
		example: GroupDecksStatus.Paused,
		maxLength: 20,
		required: false,
	})
	@IsOptional()
	@IsEnum(GroupDecksStatus, {
		message: "Status must be valid value: active, paused, concluded, working",
	})
	@Expose()
	status?: GroupDecksStatus;
}
