import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
} from "typeorm";
import { Card } from "./cards.entity";
import { Tag } from "./tags.entity";

@Entity("card_tags")
export class CardTag {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	cardId: string;

	@ManyToOne(() => Card)
	card: Card;

	@Column()
	tagId: string;

	@ManyToOne(() => Tag)
	tag: Tag;

	@CreateDateColumn()
	createdAt: Date;
}
