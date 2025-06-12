import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedRoom1749706498986 implements MigrationInterface {
    name = 'ModifiedRoom1749706498986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`room\` ADD \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`room\` ADD \`image\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`room\` DROP COLUMN \`image\``);
        await queryRunner.query(`ALTER TABLE \`room\` DROP COLUMN \`description\``);
    }

}
