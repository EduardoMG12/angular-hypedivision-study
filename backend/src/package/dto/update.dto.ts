import { IsOptional, IsUUID, MaxLength } from "class-validator";

import { Expose } from "class-transformer";

export class UpdatePackageDto {
	@Expose()
	@IsUUID()
	id: string;

	@MaxLength(100)
	@IsOptional()
	@Expose()
	title: string;

	@MaxLength(1000)
	@IsOptional()
	@Expose()
	description?: string;

	@IsOptional()
	@Expose()
	status?: string;
}
