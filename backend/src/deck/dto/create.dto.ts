import { Expose } from "class-transformer";
import { IsOptional, IsString, IsUUID } from "class-validator";
import { User } from "src/entities/user.entity";

import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export class CreateDeckDto {
	@Expose()
	@IsString()
	title: string;

	@Expose()
	@IsOptional()
	@IsString()
	description?: string;

	@Expose()
	owner: User;

	@Expose()
	@IsOptional()
	@IsUUID()
	group_decks?: string;

	@Expose()
	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@Expose()
	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updatedAt: Date;
}
