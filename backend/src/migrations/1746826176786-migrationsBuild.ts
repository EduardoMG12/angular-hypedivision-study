import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationsBuild1746826176786 implements MigrationInterface {
    name = 'MigrationsBuild1746826176786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "group_decks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "description" text, "status" character varying(20) NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "ownerId" uuid NOT NULL, CONSTRAINT "PK_ec819cd306204c9b7c8409872ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "card_content_flip" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "front" text NOT NULL, "back" text NOT NULL, "card_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "REL_addeb12c13d2fe3fab9bb5d2a4" UNIQUE ("card_id"), CONSTRAINT "PK_84312797ef76c80d47b9a875033" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(20) NOT NULL DEFAULT 'flip', "title" character varying(255), "description" character varying(255), "status" character varying(20) NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "owner_id" uuid NOT NULL, CONSTRAINT "PK_5f3269634705fdff4a9935860fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deck_cards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deck_id" uuid NOT NULL, "card_id" uuid NOT NULL, CONSTRAINT "PK_7143f21b3e36f538a75d3019f52" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d9566cfd86fe99c6f5a498fc22" ON "deck_cards" ("deck_id", "card_id") `);
        await queryRunner.query(`CREATE TABLE "Decks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "description" text, "status" character varying(20) NOT NULL DEFAULT 'active', "owner_id" uuid NOT NULL, "groupDecksId" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_001f26cb3ec39c1f25269943473" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "alternatives" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "alternative" text NOT NULL, "correct_alternative" boolean NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "cardId" uuid NOT NULL, CONSTRAINT "PK_2d61182402be60808d02cff9b7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "group_decks" ADD CONSTRAINT "FK_37757ed86e667db019d475cbbe9" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card_content_flip" ADD CONSTRAINT "FK_addeb12c13d2fe3fab9bb5d2a41" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cards" ADD CONSTRAINT "FK_af6aad89f759b9efecbb7e2e593" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deck_cards" ADD CONSTRAINT "FK_edd1ac885107a30f7c7dc67c6b9" FOREIGN KEY ("deck_id") REFERENCES "Decks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deck_cards" ADD CONSTRAINT "FK_24bbfe322e16f8d700e4e9a2b39" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Decks" ADD CONSTRAINT "FK_30d4e4e784ced0c61e1a5f31d4b" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Decks" ADD CONSTRAINT "FK_bf0821a4584d796aad35dd7a81d" FOREIGN KEY ("groupDecksId") REFERENCES "group_decks"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "alternatives" ADD CONSTRAINT "FK_cbf5c447986a93c47c5089db47c" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alternatives" DROP CONSTRAINT "FK_cbf5c447986a93c47c5089db47c"`);
        await queryRunner.query(`ALTER TABLE "Decks" DROP CONSTRAINT "FK_bf0821a4584d796aad35dd7a81d"`);
        await queryRunner.query(`ALTER TABLE "Decks" DROP CONSTRAINT "FK_30d4e4e784ced0c61e1a5f31d4b"`);
        await queryRunner.query(`ALTER TABLE "deck_cards" DROP CONSTRAINT "FK_24bbfe322e16f8d700e4e9a2b39"`);
        await queryRunner.query(`ALTER TABLE "deck_cards" DROP CONSTRAINT "FK_edd1ac885107a30f7c7dc67c6b9"`);
        await queryRunner.query(`ALTER TABLE "cards" DROP CONSTRAINT "FK_af6aad89f759b9efecbb7e2e593"`);
        await queryRunner.query(`ALTER TABLE "card_content_flip" DROP CONSTRAINT "FK_addeb12c13d2fe3fab9bb5d2a41"`);
        await queryRunner.query(`ALTER TABLE "group_decks" DROP CONSTRAINT "FK_37757ed86e667db019d475cbbe9"`);
        await queryRunner.query(`DROP TABLE "alternatives"`);
        await queryRunner.query(`DROP TABLE "Decks"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d9566cfd86fe99c6f5a498fc22"`);
        await queryRunner.query(`DROP TABLE "deck_cards"`);
        await queryRunner.query(`DROP TABLE "cards"`);
        await queryRunner.query(`DROP TABLE "card_content_flip"`);
        await queryRunner.query(`DROP TABLE "group_decks"`);
    }

}
