import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsUUID } from "class-validator";

export class FindCardDto {
	@ApiProperty({
		description: "The unique identifier of the card to find (UUID format).",
		example: "a1b2c3d4-5e6f-7890-1234-567890abcdef",
		format: "uuid",
		required: true,
	})
	@Expose()
	@IsUUID()
	id: string;
}
