import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsOptional, IsUUID } from "class-validator";

export class UpdateFlashcardReferencePackageDto {
	@ApiProperty({
		description:
			"The ID of the new package to assign the flashcard to. Set to null to remove from any package.",
		example: "123e4567-e89b-12d3-a456-426614174000",
		nullable: true,
	})
	@Expose()
	@IsOptional()
	@IsUUID()
	packageId?: string;

	@ApiProperty({
		description: "The ID of the a flashcard when to assign of package.",
		example: "123e4567-e89b-12d3-a456-426614174000",
		nullable: false,
	})
	@Expose()
	@IsUUID()
	flashcardId: string;
}
