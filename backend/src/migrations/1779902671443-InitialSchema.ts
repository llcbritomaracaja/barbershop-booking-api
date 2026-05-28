import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1779902671443 implements MigrationInterface {
    name = 'InitialSchema1779902671443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "services" ("id_service" SERIAL NOT NULL, "name" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "description" character varying, CONSTRAINT "PK_96179d3c20f5dabb084181585c1" PRIMARY KEY ("id_service"))`);
        await queryRunner.query(`CREATE TABLE "appointments" ("id_appointment" SERIAL NOT NULL, "appointment_date" date NOT NULL, "appointment_hour" TIME NOT NULL, "payment_status" "public"."appointments_payment_status_enum" NOT NULL DEFAULT 'PENDING', "id_user" integer NOT NULL, "id_barber" integer NOT NULL, "id_service" integer NOT NULL, CONSTRAINT "PK_96d87794034b0a8a264e6e755e4" PRIMARY KEY ("id_appointment"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_422dbe002f76d223d163fa3293" ON "appointments" ("id_barber", "appointment_date", "appointment_hour") `);
        await queryRunner.query(`CREATE TABLE "users" ("id_user" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "number" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'CLIENT', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_fbb07fa6fbd1d74bee9782fb945" PRIMARY KEY ("id_user"))`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_ca0d910f623f06c41bdc8c4579e" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_2abfc1a9b69bd26a73bba099edc" FOREIGN KEY ("id_barber") REFERENCES "users"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_a7a7d353190e379b9cb2f491adb" FOREIGN KEY ("id_service") REFERENCES "services"("id_service") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_a7a7d353190e379b9cb2f491adb"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_2abfc1a9b69bd26a73bba099edc"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_ca0d910f623f06c41bdc8c4579e"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_422dbe002f76d223d163fa3293"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`DROP TABLE "services"`);
    }

}
