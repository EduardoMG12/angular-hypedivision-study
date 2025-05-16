import { ApiProperty } from "@nestjs/swagger";
import {
	IsString,
	IsOptional,
	IsUUID,
	IsDate,
	IsBoolean,
	IsNumber,
	ValidateNested,
} from "class-validator";
import { Type, Expose } from "class-transformer";
import { SimpleCardDto } from "./tag-node.dto";

export class TagDto {
	@Expose()
	@ApiProperty({
		description: "Unique identifier of the tag.",
		example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
	})
	@IsUUID()
	id: string;

	@Expose()
	@ApiProperty({ description: "Name of the tag.", example: "programming" })
	@IsString()
	name: string;

	@Expose()
	@ApiProperty({
		description: "ID of the parent tag, or null if it is a root tag.",
		example: "f0e9d8c7-b6a5-4321-0987-654321fedcba",
		nullable: true,
	})
	@IsUUID()
	@IsOptional()
	parentId?: string | null;

	@Expose()
	@ApiProperty({
		description: 'Full path of the tag (e.g., "science::biology").',
		example: "science::biology",
	})
	@IsString()
	path: string;

	@Expose()
	@ApiProperty({ description: "Child tags of this tag.", type: [TagDto] })
	@Type(() => TagDto)
	@ValidateNested({ each: true })

	@IsOptional()
	children?: TagDto[];

	@Expose()
	@ApiProperty({
		description: "Simplified card details associated with this tag.",
		type: [SimpleCardDto],
	})
	@Type(() => SimpleCardDto)
	@ValidateNested({ each: true })
	@IsOptional()
	cards?: SimpleCardDto[];

	@Expose()
	@ApiProperty({
		description: "Total count of cards in this tag and its descendants.",
		example: 5,
	})
	@IsNumber()
	childrenCardsCount: number;

	@Expose()
	@ApiProperty({
		description: "Timestamp when the tag was created.",
		example: "2023-01-01T10:00:00.000Z",
	})
	@IsDate()
	@Type(() => Date)
	createdAt: Date;

	@Expose()
	@ApiProperty({
		description: "Timestamp when the tag was last updated, or null.",
		example: "2023-01-01T11:00:00.000Z",
		nullable: true,
	})
	@IsDate()
	@Type(() => Date)
	@IsOptional()
	updatedAt?: Date | null;
}
