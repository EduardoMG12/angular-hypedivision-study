import { Expose } from "class-transformer";
import { IsOptional, IsUUID } from "class-validator";

export class MoveCardToTopicDto {
	@Expose()
	@IsUUID()
	cardId: string;

	@Expose()
	@IsUUID()
	targetTopicId?: string;

	@Expose()
	@IsOptional()
	@IsUUID()
	originalTopicId?: string;
}
