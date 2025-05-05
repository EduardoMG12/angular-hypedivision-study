import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
} from "typeorm";

import { Flashcard } from "./flashcards.entity";
import { CardType } from "./common/enums/cardsType.enum";
import { Cards } from "./cards.entity";

@Entity("alternatives")
export class Alternatives {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => Cards, { nullable: false })
	card: Cards;

	@Column({ type: "text", nullable: false })
	alternative: string;

	@Column({ type: "bool", nullable: false })
	correct_alternative: boolean;

	@Column({ type: "text", nullable: true })
	description: string;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updatedAt: Date;
}
