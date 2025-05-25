import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedFlags1748139912549 implements MigrationInterface {
    name = 'AddedFlags1748139912549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`room\` ADD \`isActive\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`customer\` ADD \`isActive\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`isActive\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`reservation\` ADD \`isActive\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`staff\` ADD \`role\` enum ('admin', 'manager', 'receptionist') NOT NULL DEFAULT 'receptionist'`);
        await queryRunner.query(`ALTER TABLE \`staff\` ADD \`isActive\` tinyint NOT NULL DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`staff\` DROP COLUMN \`isActive\``);
        await queryRunner.query(`ALTER TABLE \`staff\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`reservation\` DROP COLUMN \`isActive\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`isActive\``);
        await queryRunner.query(`ALTER TABLE \`customer\` DROP COLUMN \`isActive\``);
        await queryRunner.query(`ALTER TABLE \`room\` DROP COLUMN \`isActive\``);
    }

}
