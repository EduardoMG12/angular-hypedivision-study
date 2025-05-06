import { Expose } from "class-transformer";
import { IsUUID } from "class-validator";

export class FindCardDto {
	@Expose()
	@IsUUID()
	id: string;
}
