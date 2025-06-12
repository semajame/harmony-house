import { MigrationInterface, QueryRunner } from "typeorm";

export class RoomEntityChanged1749703019291 implements MigrationInterface {
    name = 'RoomEntityChanged1749703019291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`room\` ADD \`description\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`room\` DROP COLUMN \`description\``);
    }

}
