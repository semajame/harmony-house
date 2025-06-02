import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedOrder1748833818808 implements MigrationInterface {
    name = 'AddedOrder1748833818808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`product_id\` int NOT NULL, \`quantity\` int NOT NULL DEFAULT '1', \`unit_price\` decimal(10,2) NOT NULL, \`total_price\` decimal(10,2) NOT NULL, \`status\` enum ('pending', 'confirmed', 'completed') NOT NULL DEFAULT 'pending', \`notes\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_199e32a02ddc0f47cd93181d8fd\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_539ede39e518562dfdadfddb492\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_539ede39e518562dfdadfddb492\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_199e32a02ddc0f47cd93181d8fd\``);
        await queryRunner.query(`DROP TABLE \`order\``);
    }

}
