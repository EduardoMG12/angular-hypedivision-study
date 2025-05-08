import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
} from "typeorm";

import { CardType } from "./common/enums/cardsType.enum";
import { Deck } from "./decks.entity";

@Entity("cards")
export class Cards {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => Deck, { nullable: true })
	deck: Deck | null;

	@Column({ type: "varchar", length: 20, default: CardType.Flip })
	type: CardType;

	@Column({ type: "text", nullable: false })
	frontend: string;

	@Column({ type: "text", nullable: false })
	backend: string;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updatedAt: Date;
}
