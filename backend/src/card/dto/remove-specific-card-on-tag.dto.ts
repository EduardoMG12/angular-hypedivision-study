import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsUUID } from "class-validator";

export class RemoveSpecificCardOnTag {
	@ApiProperty({
		type: String,
		format: "uuid",
		description:
			"The unique identifier of the card from which to remove the tag",
		example: "013aab30-e740-482b-9b98-c3f09607ba3f",
		required: true,
	})
	@IsUUID()
	@Expose()
	cardId: string;

	@ApiProperty({
		type: String,
		format: "uuid",
		description: "The unique identifier of the tag to be removed from the card",
		example: "27c58d88-ee35-4eac-a78a-b6d71d709dc0",
		required: true,
	})
	@IsUUID()
	@Expose()
	tagId: string;
}
