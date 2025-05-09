// src/entities/deck_card.entity.ts (NOVA Entidade para a Tabela de Junção)
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	Index,
	CreateDateColumn,
	JoinColumn,
} from "typeorm";
import { Deck } from "./decks.entity";
import { Card } from "./cards.entity";

@Entity("deck_cards")
@Index(["deckId", "cardId"], { unique: true })
export class DeckCard {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "integer", nullable: true })
	order: number | null;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;
	@Column({ name: "deck_id" })
	deckId: string;

	@ManyToOne(
		() => Deck,
		(deck) => deck.deckCards,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "deck_id" })
	deck: Deck;

	@Column({ name: "card_id" })
	cardId: string;

	@ManyToOne(
		() => Card,
		(card) => card.deckCards,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "card_id" })
	card: Card;

	// Soft delete (se estiver usando)
	// @DeleteDateColumn({ name: 'deleted_at', nullable: true })
	// deletedAt?: Date;
}
