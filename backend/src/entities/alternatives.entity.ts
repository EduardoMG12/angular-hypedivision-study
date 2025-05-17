import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
} from "typeorm";

import { CardType } from "./common/enums/cards-type.enum";
import { Card } from "./cards.entity";

@Entity("alternatives")
export class Alternatives {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => Card, { nullable: false })
	card: Card;

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
