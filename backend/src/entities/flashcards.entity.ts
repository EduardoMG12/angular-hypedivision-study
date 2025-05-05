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
import { Package } from "./package.entity";
import { Cards } from "./cards.entity";
import { FlashcardStatus } from "./common/enums/flashcardStatus.enum";

@Entity("flashcards")
export class Flashcard {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 100 })
	title: string;

	@Column({ type: "text", nullable: true })
	description: string;

	@ManyToOne(() => User, { nullable: false })
	owner: User;

	@ManyToOne(() => Package, { nullable: true })
	package: Package | null;

	@OneToMany(
		() => Cards,
		(card) => card.flashcard,
		{ cascade: true, nullable: true },
	)
	cards: Cards[];

	@Column({ type: "varchar", length: 20, default: FlashcardStatus.Active })
	status: FlashcardStatus;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updatedAt: Date;
}
