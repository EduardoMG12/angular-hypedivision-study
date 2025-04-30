import { Expose } from "class-transformer";
import { IsString, IsUUID, MaxLength } from "class-validator";

export class PackageDto {
	@Expose()
	@IsUUID()
	id: string;

	@Expose()
	@IsString()
	@MaxLength(100)
	title: string;

	@Expose()
	@IsString()
	@MaxLength(1000)
	description?: string;

	@Expose()
	@IsString()
	@MaxLength(20)
	status: string;

	@Expose()
	@IsUUID()
	ownerId: string;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;
}
