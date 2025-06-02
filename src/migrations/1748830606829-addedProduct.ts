import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedProduct1748830606829 implements MigrationInterface {
    name = 'AddedProduct1748830606829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`sku\` varchar(50) NOT NULL, \`description\` text NULL, \`price\` decimal(10,2) NOT NULL, \`quantity\` int NOT NULL DEFAULT '0', \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_34f6ca1cd897cc926bdcca1ca3\` (\`sku\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_34f6ca1cd897cc926bdcca1ca3\` ON \`product\``);
        await queryRunner.query(`DROP TABLE \`product\``);
    }

}
