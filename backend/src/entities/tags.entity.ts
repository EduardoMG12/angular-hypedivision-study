import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	Index,
} from "typeorm";

@Entity("tags")
@Index(["parentId", "name"], { unique: true })
@Index(["path"])
export class Tag {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ nullable: true })
	parentId?: string;

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

	@Column({ nullable: true })
	deletedAt?: Date;
}
