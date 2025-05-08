import { Expose } from "class-transformer";
import { IsEnum, IsString, IsUUID, MaxLength } from "class-validator";
import { Package } from "src/entities/package.entity";
import { User } from "src/entities/user.entity";
import { DeckStatus } from "../common/enums/deckStatus.enum";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export class DeckDto {
	@Expose()
	@IsUUID()
	id: string;

	@Expose()
	@IsString()
	@MaxLength(100)
	title: string;

	@Expose()
	@IsString()
	description: string;

	@Expose()
	owner: User;

	@Expose()
	package: Package | null;

	@Expose()
	@IsEnum(DeckStatus, {
		message: "Status can be valid value: active, paused, concluded, working",
	})
	status?: DeckStatus;

	@Expose()
	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@Expose()
	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updatedAt: Date;
}
