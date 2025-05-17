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
import { GroupDecksStatus } from "./common/enums/group-decks-status.enum";
import { Deck } from "./decks.entity";

@Entity("group_decks")
export class GroupDecks {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 100 })
	title: string;

	@Column({ type: "text", nullable: true })
	description: string;

	@ManyToOne(() => User, { nullable: false })
	owner: User;

	@Column({ type: "varchar", length: 20, default: GroupDecksStatus.Active })
	status: GroupDecksStatus;

	@OneToMany(
		() => Deck,
		(deck) => deck.groupDeck,
		{ cascade: true },
	)
	decks: Deck[];

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updatedAt: Date;
}
