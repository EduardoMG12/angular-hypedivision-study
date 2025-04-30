import { Expose } from "class-transformer";
import { IsString, IsUUID, MaxLength } from "class-validator";

export class CreatePackageDto {
	@Expose()
	@IsString()
	@MaxLength(100)
	title: string;

	@Expose()
	@IsString()
	@MaxLength(1000)
	description?: string;

	@Expose()
	@IsUUID()
	ownerId: string;
}
