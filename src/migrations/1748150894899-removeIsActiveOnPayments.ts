import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveIsActiveOnPayments1748150894899 implements MigrationInterface {
    name = 'RemoveIsActiveOnPayments1748150894899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`isActive\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`isActive\` tinyint NOT NULL DEFAULT '1'`);
    }

}
