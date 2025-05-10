import { Expose } from "class-transformer";

import { DeckStatus } from "../common/enums/deckStatus.enum";
import { IsUUID } from "class-validator";

export class DeckDto {
	@IsUUID()
	@Expose()
	id: string;

	@Expose()
	title: string;

	@Expose()
	description: string;

	@Expose()
	status: DeckStatus;

	@IsUUID()
	@Expose()
	ownerId: string;

	@IsUUID()
	@Expose()
	groupDecksId: string | null;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;
}
