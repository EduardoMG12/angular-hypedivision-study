import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { GroupDecks } from "./group_decks.entity";
import { Cards } from "./cards.entity";
import { DeckStatus } from "./common/enums/deckStatus.enum";

@Entity("Decks")
export class Deck {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 100 })
	title: string;

	@Column({ type: "text", nullable: true })
	description: string;

	@ManyToOne(() => User, { nullable: false })
	owner: User;

	@ManyToOne(() => GroupDecks, { nullable: true })
	group_decks: GroupDecks | null;

	@OneToMany(
		() => Cards,
		(card) => card.deck,
		{ cascade: true, nullable: true },
	)
	cards: Cards[];

	@Column({ type: "varchar", length: 20, default: DeckStatus.Active })
	status: DeckStatus;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updatedAt: Date;
}
