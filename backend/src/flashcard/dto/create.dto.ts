import { Expose } from "class-transformer";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { Package } from "src/entities/package.entity";
import { User } from "src/entities/user.entity";

import { FlashcardStatus } from "../common/enums/flashcardStatus.enum";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export class CreateFlashcardDto {
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
	package?: string;

	@Expose()
	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@Expose()
	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updatedAt: Date;
}
