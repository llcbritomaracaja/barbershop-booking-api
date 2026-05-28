import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1780001987021 implements MigrationInterface {
    name = 'InitialSchema1780001987021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" ADD "guest_name" character varying`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "guest_email" character varying`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "guest_number" character varying`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_ca0d910f623f06c41bdc8c4579e"`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "id_user" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_ca0d910f623f06c41bdc8c4579e" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_ca0d910f623f06c41bdc8c4579e"`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "id_user" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_ca0d910f623f06c41bdc8c4579e" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "guest_number"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "guest_email"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "guest_name"`);
    }

}
