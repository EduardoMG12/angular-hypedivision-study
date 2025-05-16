import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	Index,
	DeleteDateColumn,
} from "typeorm";

@Entity("tags")
@Index(["parentId", "name"], { unique: true })
@Index(["path"])
export class Tag {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "uuid", nullable: true })
	parentId?: string | null;

	@ManyToOne(() => Tag, { nullable: true, onDelete: "CASCADE" })
	parent?: Tag;

	@OneToMany(
		() => Tag,
		(tag) => tag.parent,
	)
	children?: Tag[];

	@Column({ length: 100 })
	name: string;

	@Column({ type: "text" })
	path: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn({ nullable: true })
	updatedAt?: Date;

	@DeleteDateColumn({ name: "delete_at", nullable: true })
	deletedAt?: Date | null;
}
