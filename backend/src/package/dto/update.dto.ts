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
import { PackageStatus } from "../common/enums/packageStatus.enum";

export class UpdatePackageDto {
	@ApiProperty({
		description: "Unic ID of Package to find what Package be updated",
		example: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
		format: "uuid",
	})
	@Expose()
	@IsUUID()
	@IsNotEmpty()
	id: string;

	@ApiProperty({
		description: "New title of package (optional)",
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
		description: "New description of package do Pacote (optional)",
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
		description: "New status of Package (optional)",
		enum: PackageStatus,
		example: PackageStatus.Paused,
		maxLength: 20,
		required: false,
	})
	@IsOptional()
	@IsEnum(PackageStatus, {
		message: "Status must be valid value: active, paused, concluded, working",
	})
	@Expose()
	status?: PackageStatus;
}
