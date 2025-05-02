import { Expose } from "class-transformer";
import { IsString, IsUUID, MaxLength } from "class-validator";
import { User } from "src/entities/user.entity";

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
	owner: User;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;
}
