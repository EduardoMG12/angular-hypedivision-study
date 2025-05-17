import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	OneToMany,
} from "typeorm";
import { Deck } from "./decks.entity";
import { Card } from "./cards.entity";
@Entity("users")
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ length: 100 })
	fullName: string;

	@Column()
	birthdate: Date;

	@Column({ length: 14, unique: true })
	@Column()
	phone: string;

	@Column({ length: 100, unique: true })
	email: string;

	@Column()
	password: string;

	@OneToMany(
		() => Deck,
		(deck) => deck.owner,
	)
	ownedDecks: Deck[];

	@OneToMany(
		() => Card,
		(card) => card.owner,
	)
	ownedCards: Card[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at: Date | null;
}
