import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
} from "typeorm";

import { CardType } from "./common/enums/cardsType.enum";
import { User } from "./user.entity";
import { DeckCard } from "./deckCards.entity";
import { CardContentFlip } from "./cardContentFlip.entity";

@Entity("cards")
export class Card {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 20, default: CardType.Flip })
	type: CardType;

	@Column({ type: "varchar", length: 255, nullable: true })
	title: string | null;

	@Column({ type: "varchar", length: 255, nullable: true })
	description: string | null;

	@Column({ type: "varchar", length: 20, default: "active" })
	status: string;

	@Column({ name: "owner_id" })
	ownerId: string;

	@ManyToOne(() => User, { nullable: false })
	owner: User;

	@OneToMany(
		() => DeckCard,
		(deckCard) => deckCard.card,
	)
	deckCards: DeckCard[];

	@OneToOne(
		() => CardContentFlip,
		(content) => content.card,
	)
	contentFlip: CardContentFlip;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updatedAt: Date;
}
