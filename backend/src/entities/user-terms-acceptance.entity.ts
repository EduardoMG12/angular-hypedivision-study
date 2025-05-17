import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { TermsOfUse } from "./terms-of-use.entity";
import { User } from "./user.entity";

@Entity("user_terms_acceptance")
export class UserTermsAcceptance {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => User, { nullable: false })
	@JoinColumn({ name: "userId" })
	user: User;

	@ManyToOne(() => TermsOfUse, { nullable: false })
	@JoinColumn({ name: "termsOfUseId" })
	termsOfUse: TermsOfUse;

	@Column({ type: "varchar", length: 50 })
	termsVersion: string; // Armazena a versão aceita (para auditoria)

	@CreateDateColumn()
	acceptedAt: Date; // Quando o usuário aceitou os termos
}
