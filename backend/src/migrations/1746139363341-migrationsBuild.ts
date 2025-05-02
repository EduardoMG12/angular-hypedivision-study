import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationsBuild1746139363341 implements MigrationInterface {
    name = 'MigrationsBuild1746139363341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "terms_of_use" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "version" character varying(50) NOT NULL, "content" text NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_876c6c2717bea0d112b5a863cc1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying(100) NOT NULL, "birthdate" TIMESTAMP NOT NULL, "cpfOrCnpj" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying(100) NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_30bff1ae341ca4a93032cf2a402" UNIQUE ("cpfOrCnpj"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_terms_acceptance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "termsVersion" character varying(50) NOT NULL, "acceptedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "termsOfUseId" uuid NOT NULL, CONSTRAINT "PK_d9f786de5e391846f31974775c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "packages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "description" text, "status" character varying(20) NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "ownerId" uuid NOT NULL, CONSTRAINT "PK_020801f620e21f943ead9311c98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_terms_acceptance" ADD CONSTRAINT "FK_36683fb022baf0b2d54e0bf0d2f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_terms_acceptance" ADD CONSTRAINT "FK_2c0918d02cdbfa3caba735fe4d5" FOREIGN KEY ("termsOfUseId") REFERENCES "terms_of_use"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "packages" ADD CONSTRAINT "FK_f2b99d8def9dcdf2d91a7593632" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "packages" DROP CONSTRAINT "FK_f2b99d8def9dcdf2d91a7593632"`);
        await queryRunner.query(`ALTER TABLE "user_terms_acceptance" DROP CONSTRAINT "FK_2c0918d02cdbfa3caba735fe4d5"`);
        await queryRunner.query(`ALTER TABLE "user_terms_acceptance" DROP CONSTRAINT "FK_36683fb022baf0b2d54e0bf0d2f"`);
        await queryRunner.query(`DROP TABLE "packages"`);
        await queryRunner.query(`DROP TABLE "user_terms_acceptance"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "terms_of_use"`);
    }

}
