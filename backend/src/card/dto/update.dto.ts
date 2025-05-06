import { IsOptional, IsString, IsEnum, IsUUID } from "class-validator";
import { CardType } from "../common/enum/cardType.enum";
import { Expose } from "class-transformer";

export class UpdateCardDto {
	@Expose()
	@IsUUID()
	cardId: string;

	@IsOptional()
	@IsString()
	@Expose()
	frontend?: string;

	@IsOptional()
	@IsString()
	@Expose()
	backend?: string;
}
