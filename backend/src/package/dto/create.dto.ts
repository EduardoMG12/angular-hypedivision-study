import { Expose } from "class-transformer";
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
} from "class-validator";

export class CreatePackageDto {
	@IsString()
	@MaxLength(100)
	@IsNotEmpty()
	@Expose()
	title: string;

	@MaxLength(1000)
	@IsOptional()
	@Expose()
	description?: string;
}
