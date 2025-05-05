import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationsBuild1746466291500 implements MigrationInterface {
    name = 'MigrationsBuild1746466291500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "packages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "description" text, "status" character varying(20) NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "ownerId" uuid NOT NULL, CONSTRAINT "PK_020801f620e21f943ead9311c98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(20) NOT NULL DEFAULT 'flip', "frontend" text NOT NULL, "backend" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "flashcardId" uuid, CONSTRAINT "PK_5f3269634705fdff4a9935860fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "flashcards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "description" text, "status" character varying(20) NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "ownerId" uuid NOT NULL, "packageId" uuid, CONSTRAINT "PK_9acf891ec7aaa7ca05c264ea94d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "alternatives" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "alternative" text NOT NULL, "correct_alternative" boolean NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "cardId" uuid NOT NULL, CONSTRAINT "PK_2d61182402be60808d02cff9b7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "packages" ADD CONSTRAINT "FK_f2b99d8def9dcdf2d91a7593632" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cards" ADD CONSTRAINT "FK_22400488df68a94490fd5238dd2" FOREIGN KEY ("flashcardId") REFERENCES "flashcards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flashcards" ADD CONSTRAINT "FK_83c838b083a5b7a7bf009c3f306" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flashcards" ADD CONSTRAINT "FK_0fc625031478a62cff57367c84c" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "alternatives" ADD CONSTRAINT "FK_cbf5c447986a93c47c5089db47c" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alternatives" DROP CONSTRAINT "FK_cbf5c447986a93c47c5089db47c"`);
        await queryRunner.query(`ALTER TABLE "flashcards" DROP CONSTRAINT "FK_0fc625031478a62cff57367c84c"`);
        await queryRunner.query(`ALTER TABLE "flashcards" DROP CONSTRAINT "FK_83c838b083a5b7a7bf009c3f306"`);
        await queryRunner.query(`ALTER TABLE "cards" DROP CONSTRAINT "FK_22400488df68a94490fd5238dd2"`);
        await queryRunner.query(`ALTER TABLE "packages" DROP CONSTRAINT "FK_f2b99d8def9dcdf2d91a7593632"`);
        await queryRunner.query(`DROP TABLE "alternatives"`);
        await queryRunner.query(`DROP TABLE "flashcards"`);
        await queryRunner.query(`DROP TABLE "cards"`);
        await queryRunner.query(`DROP TABLE "packages"`);
    }

}
