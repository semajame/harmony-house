import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedOrderStatus1748835464234 implements MigrationInterface {
    name = 'ModifiedOrderStatus1748835464234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`status\` \`status\` enum ('pending', 'cancelled', 'completed') NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`status\` \`status\` enum ('pending', 'confirmed', 'completed') NOT NULL DEFAULT 'pending'`);
    }

}
