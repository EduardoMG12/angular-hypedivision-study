import { Expose } from "class-transformer";
import { IsEnum, IsString, IsUUID, MaxLength } from "class-validator";
import { User } from "src/entities/user.entity";
import { PackageStatus } from "../common/enums/packageStatus.enum";

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

	@IsEnum(PackageStatus, {
		message:
			"Status deve ser um valor válido: active, paused, concluded, working",
	})
	@Expose()
	status?: PackageStatus;

	@Expose()
	owner: User;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;
}
