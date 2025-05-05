import { IsOptional, IsString, IsEnum } from "class-validator";
import { CardType } from "../common/enum/cardType.enum";
import { Expose } from "class-transformer";

export class UpdateCardDto {
	@IsOptional()
	@IsString()
	@Expose()
	frontend?: string;

	@IsOptional()
	@IsString()
	@Expose()
	backend?: string;

	@IsOptional()
	@IsEnum(CardType)
	@Expose()
	type?: CardType;
}
