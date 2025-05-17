import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";
import { Card } from "./cards.entity";

@Entity("card_content_flip")
export class CardContentFlip {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "text", nullable: false })
	front: string;

	@Column({ type: "text", nullable: false })
	back: string;

	@Column({ name: "card_id" })
	cardId: string;

	@OneToOne(
		() => Card,
		(card) => card.contentFlip,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "card_id" })
	card: Card;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updatedAt?: Date;
}
