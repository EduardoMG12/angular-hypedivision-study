import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsUUID } from "class-validator";

export class RemoveSpecificCardOnTag {
	@ApiProperty({ example: "uuid" })
	@IsUUID()
	@Expose()
	cardId: string;

	@ApiProperty({ example: "uuid" })
	@IsUUID()
	@Expose()
	tagId: string;
}
