import { Expose, Type } from "class-transformer";
import {
	IsEnum,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
} from "class-validator";
import { User } from "src/entities/user.entity";
import { PackageStatus } from "../common/enums/packageStatus.enum";
import { ApiProperty } from "@nestjs/swagger";
import { PackageDto } from "./package.dto";
import { DeckDto } from "src/deck/dto/deck.dto";

export class PackageWithDecksDto extends PackageDto {
	@ApiProperty({
		description: "List of Decks associated with this Package",
		type: [DeckDto],
		example: [
			{
				id: "deck-id-1",
				title: "Card 1",
				description: "Answer 1",
			},
		],
	})
	@Expose()
	@Type(() => DeckDto)
	decks: DeckDto[];
}
