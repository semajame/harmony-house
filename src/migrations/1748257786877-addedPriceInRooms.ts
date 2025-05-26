import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPriceInRooms1748257786877 implements MigrationInterface {
    name = 'AddedPriceInRooms1748257786877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`room\` ADD \`price\` decimal(10,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`room\` DROP COLUMN \`price\``);
    }

}
