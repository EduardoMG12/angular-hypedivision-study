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
import { PackageStatus } from "./common/enums/packageStatus.enum";
import { Deck } from "./decks.entity";

@Entity("packages")
export class Package {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 100 })
	title: string;

	@Column({ type: "text", nullable: true })
	description: string;

	@ManyToOne(() => User, { nullable: false })
	owner: User;

	@Column({ type: "varchar", length: 20, default: PackageStatus.Active })
	status: PackageStatus;

	@OneToMany(
		() => Deck,
		(deck) => deck.package,
		{ cascade: true },
	)
	decks: Deck[];

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updatedAt: Date;
}
