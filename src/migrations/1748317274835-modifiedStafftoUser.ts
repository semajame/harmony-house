import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedStafftoUser1748317274835 implements MigrationInterface {
    name = 'ModifiedStafftoUser1748317274835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`phone\` varchar(20) NULL, \`role\` enum ('admin', 'staff', 'costumer') NOT NULL DEFAULT 'costumer', \`isActive\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`customer\` ADD UNIQUE INDEX \`IDX_fdb2f3ad8115da4c7718109a6e\` (\`email\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer\` DROP INDEX \`IDX_fdb2f3ad8115da4c7718109a6e\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
