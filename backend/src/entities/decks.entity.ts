import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { GroupDecks } from "./group_decks.entity";
import { Card } from "./cards.entity";
import { DeckStatus } from "./common/enums/deckStatus.enum";
import { DeckCard } from "./deckCards.entity";

@Entity("Decks")
export class Deck {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 100 })
	title: string;

	@Column({ type: "text", nullable: true })
	description: string;

	@Column({ type: "varchar", length: 20, default: DeckStatus.Active })
	status: DeckStatus;

	@Column({ name: "owner_id" })
	ownerId: string;

	@ManyToOne(
		() => User,
		(user) => user.ownedDecks,
		{ nullable: false },
	)
	@JoinColumn({ name: "owner_id" })
	owner: User;

	@Column({ name: "groupDecksId", nullable: true })
	groupDecksId: string | null;

	@ManyToOne(
		() => GroupDecks,
		(groupDeck) => groupDeck.decks,
		{ nullable: true, onDelete: "SET NULL" },
	)
	@JoinColumn({ name: "groupDecksId" })
	groupDeck: GroupDecks | null;

	@OneToMany(
		() => DeckCard,
		(deckCard) => deckCard.deck,
	)
	deckCards: DeckCard[];

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updatedAt: Date;
}
