import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationsBuild1746196967323 implements MigrationInterface {
    name = 'MigrationsBuild1746196967323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "flashcards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "description" text, "status" character varying(20) NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "ownerId" uuid NOT NULL, "packageId" uuid, CONSTRAINT "PK_9acf891ec7aaa7ca05c264ea94d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "flashcards" ADD CONSTRAINT "FK_83c838b083a5b7a7bf009c3f306" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flashcards" ADD CONSTRAINT "FK_0fc625031478a62cff57367c84c" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flashcards" DROP CONSTRAINT "FK_0fc625031478a62cff57367c84c"`);
        await queryRunner.query(`ALTER TABLE "flashcards" DROP CONSTRAINT "FK_83c838b083a5b7a7bf009c3f306"`);
        await queryRunner.query(`DROP TABLE "flashcards"`);
    }

}
