import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	JoinColumn,
} from "typeorm";

import { CardType } from "./common/enums/cardsType.enum";
import { User } from "./user.entity";
import { DeckCard } from "./deckCards.entity";
import { CardContentFlip } from "./cardContentFlip.entity";

import { CardTag } from "./cardTags.entity";

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

	@ManyToOne(() => User, { nullable: false })
	@JoinColumn({ name: "owner_id" })
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

	@OneToMany(
		() => CardTag,
		(tag) => tag.card,
	)
	card_tag: CardTag;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updatedAt: Date;
}
