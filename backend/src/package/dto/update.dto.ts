import { IsEnum, IsOptional, IsUUID, MaxLength } from "class-validator";

import { Expose } from "class-transformer";
import { PackageStatus } from "../common/enums/packageStatus.enum";

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

	@IsEnum(PackageStatus, {
		message:
			"Status deve ser um valor válido: active, paused, concluded, working",
	})
	@Expose()
	status?: PackageStatus;
}
