import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1745337529865 implements MigrationInterface {
  name = 'Test1745337529865';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" SERIAL NOT NULL, "title" character varying(250), "details" text NOT NULL DEFAULT '', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "posts_pkey" ON "posts" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying(250) NOT NULL, "password" character varying(250) NOT NULL, "last_signed_in_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "users_pkey" ON "users" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "users_email_key" ON "users" ("email") `,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_5e508187fcc1b87d59e3673c766" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_5e508187fcc1b87d59e3673c766"`,
    );
    await queryRunner.query(`DROP INDEX "public"."users_email_key"`);
    await queryRunner.query(`DROP INDEX "public"."users_pkey"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP INDEX "public"."posts_pkey"`);
    await queryRunner.query(`DROP TABLE "posts"`);
  }
}
