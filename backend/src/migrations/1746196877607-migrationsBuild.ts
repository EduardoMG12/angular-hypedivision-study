import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationsBuild1746196877607 implements MigrationInterface {
    name = 'MigrationsBuild1746196877607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "packages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "description" text, "status" character varying(20) NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "ownerId" uuid NOT NULL, CONSTRAINT "PK_020801f620e21f943ead9311c98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "packages" ADD CONSTRAINT "FK_f2b99d8def9dcdf2d91a7593632" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "packages" DROP CONSTRAINT "FK_f2b99d8def9dcdf2d91a7593632"`);
        await queryRunner.query(`DROP TABLE "packages"`);
    }

}
