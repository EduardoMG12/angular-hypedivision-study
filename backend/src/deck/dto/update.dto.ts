import { Expose } from "class-transformer";
import { IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class UpdateDeckDto {
	@Expose()
	@IsUUID()
	id: string;

	@Expose()
	@IsString()
	@MaxLength(100)
	@IsOptional()
	title?: string;

	@Expose()
	@IsString()
	@IsOptional()
	description?: string;
}
