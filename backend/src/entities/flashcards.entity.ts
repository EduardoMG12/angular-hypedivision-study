import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
} from "typeorm";
import { User } from "./user.entity";
import { Package } from "./package.entity";

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
	package: Package;

	@Column({ type: "varchar", length: 20, default: "active" })
	status: string;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updatedAt: Date;
}
