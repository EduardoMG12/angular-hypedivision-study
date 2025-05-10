import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateDeckDto {
	@IsString()
	@IsNotEmpty()
	@Expose()
	title: string;

	@IsString()
	@IsOptional()
	@Expose()
	description?: string;

	@IsUUID()
	@IsOptional()
	@Expose()
	groupDecksId?: string;
}
