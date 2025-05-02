import { Expose } from "class-transformer";
import { IsString, IsUUID, MaxLength } from "class-validator";

export class ChangePackageStatusDto {
	@Expose()
	@IsUUID()
	id: string;

	@Expose()
	@IsString()
	@MaxLength(20)
	status: string;
}
