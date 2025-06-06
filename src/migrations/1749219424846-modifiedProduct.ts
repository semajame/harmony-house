import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedProduct1749219424846 implements MigrationInterface {
    name = 'ModifiedProduct1749219424846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_34f6ca1cd897cc926bdcca1ca3\` ON \`product\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`sku\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`quantity\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`quantity\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`sku\` varchar(50) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_34f6ca1cd897cc926bdcca1ca3\` ON \`product\` (\`sku\`)`);
    }

}
