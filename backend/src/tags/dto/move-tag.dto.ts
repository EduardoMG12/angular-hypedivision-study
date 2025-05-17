import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString, IsOptional, IsUUID } from "class-validator";

export class MoveTagDto {
	@ApiProperty({
		description: "O ID da tag a ser movida.",
		example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
	})
	@IsString()
	@IsUUID()
	@Expose()
	tagId: string;

	@ApiProperty({
		description:
			"O ID da tag pai de destino. Nulo ou omitido para mover para a raiz.",
		example: "f0e9d8c7-b6a5-4321-0987-654321fedcba",
		required: false,
		nullable: true,
	})
	@IsString()
	@IsUUID()
	@IsOptional()
	@Expose()
	targetParentId?: string | null;
}
