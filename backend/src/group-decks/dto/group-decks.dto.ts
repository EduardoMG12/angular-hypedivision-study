import { Expose } from "class-transformer";
import {
	IsEnum,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
} from "class-validator";
import { User } from "src/entities/user.entity";
import { GroupDecksStatus } from "../common/enums/group-decksStatus.enum";
import { ApiProperty } from "@nestjs/swagger";

export class GroupDecksDto {
	@ApiProperty({
		description: "unic ID of GroupDecks",
		example: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
		format: "uuid",
	})
	@Expose()
	@IsUUID()
	id: string;

	@ApiProperty({
		description: "GroupDecks title",
		example: "My new revision deck",
		maxLength: 100,
	})
	@Expose()
	@IsString()
	@MaxLength(100)
	title: string;

	@ApiProperty({
		description: "GroupDecks description",
		example: "Deck to revise NestJS concepts",
		maxLength: 1000,
		nullable: true,
	})
	@Expose()
	@IsOptional()
	@IsString()
	@MaxLength(1000)
	description?: string;

	@ApiProperty({
		description: "GroupDecks Status",
		enum: GroupDecksStatus,
		example: GroupDecksStatus.Active,
		maxLength: 20,
	})
	@IsEnum(GroupDecksStatus, {
		message: "Status can be valid value: active, paused, concluded, working",
	})
	@Expose()
	status?: GroupDecksStatus;

	@ApiProperty({
		description: "Owner user of group of decks",
		type: User,
	})
	@Expose()
	owner: User;

	@ApiProperty({
		description: "GroupDecks creating date",
		example: "2023-10-27T10:00:00Z",
		format: "date-time",
	})
	@Expose()
	createdAt: Date;

	@ApiProperty({
		description: "The Date of last group of decks update",
		example: "2023-10-27T10:30:00Z",
		format: "date-time",
		nullable: true,
	})
	@Expose()
	updatedAt: Date;
}
