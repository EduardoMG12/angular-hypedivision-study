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

@Entity("cards")
export class Cards {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => Flashcard, { nullable: true })
	flashcard: Flashcard | null;

	@Column({ type: "varchar", length: 20, default: CardType.Flip })
	type: CardType;

	@Column({ type: "text", nullable: false })
	question: string; // frontend?

	@Column({ type: "text", nullable: false })
	answer: string; // backend? // missing make pnpm migration:generate migration:run

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updatedAt: Date;
}
