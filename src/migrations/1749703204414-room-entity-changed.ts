import { MigrationInterface, QueryRunner } from "typeorm";

export class RoomEntityChanged1749703204414 implements MigrationInterface {
    name = 'RoomEntityChanged1749703204414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`room\` ADD \`image\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`room\` DROP COLUMN \`image\``);
    }

}
