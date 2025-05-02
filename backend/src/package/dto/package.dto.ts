import { Expose } from "class-transformer";
import {
	IsEnum,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
} from "class-validator";
import { User } from "src/entities/user.entity";
import { PackageStatus } from "../common/enums/packageStatus.enum";
import { ApiProperty } from "@nestjs/swagger";

export class PackageDto {
	@ApiProperty({
		description: "unic ID of Package",
		example: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
		format: "uuid",
	})
	@Expose()
	@IsUUID()
	id: string;

	@ApiProperty({
		description: "Package title",
		example: "My new revision deck",
		maxLength: 100,
	})
	@Expose()
	@IsString()
	@MaxLength(100)
	title: string;

	@ApiProperty({
		description: "Package description",
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
		description: "Package Status",
		enum: PackageStatus,
		example: PackageStatus.Active,
		maxLength: 20,
	})
	@IsEnum(PackageStatus, {
		message: "Status can be valid value: active, paused, concluded, working",
	})
	@Expose()
	status?: PackageStatus;

	@ApiProperty({
		description: "Owner user of package",
		type: User,
	})
	@Expose()
	owner: User;

	@ApiProperty({
		description: "Package creating date",
		example: "2023-10-27T10:00:00Z",
		format: "date-time",
	})
	@Expose()
	createdAt: Date;

	@ApiProperty({
		description: "The Date of last package update",
		example: "2023-10-27T10:30:00Z",
		format: "date-time",
		nullable: true,
	})
	@Expose()
	updatedAt: Date;
}
