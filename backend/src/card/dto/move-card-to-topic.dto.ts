import { Expose } from "class-transformer";
import { IsOptional, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class MoveCardToTopicDto {
	@Expose()
	@IsUUID()
	@ApiProperty({
		type: String,
		format: "uuid",
		description: "The unique identifier of the card to be moved",
		example: "013aab30-e740-482b-9b98-c3f09607ba3f",
		required: true,
	})
	cardId: string;

	@Expose()
	@IsOptional()
	@IsUUID()
	@ApiProperty({
		type: String,
		format: "uuid",
		description:
			"The unique identifier of the target topic to move the card to. If not provided, the card will be moved to 'no topic'.",
		example: "27c58d88-ee35-4eac-a78a-b6d71d709dc0",
		required: false,
	})
	targetTopicId?: string;

	@Expose()
	@IsOptional()
	@IsUUID()
	@ApiProperty({
		type: String,
		format: "uuid",
		description:
			"The unique identifier of the original topic the card is being moved from. If not provided, the card is assumed to have no original topic.",
		example: "0a172ec9-0df9-4fc8-a4ec-131207fe5831",
		required: false,
	})
	originalTopicId?: string;
}
