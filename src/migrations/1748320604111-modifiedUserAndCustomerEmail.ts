import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedUserAndCustomerEmail1748320604111 implements MigrationInterface {
    name = 'ModifiedUserAndCustomerEmail1748320604111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_fdb2f3ad8115da4c7718109a6e\` ON \`customer\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`email\` \`email\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`email\` \`email\` varchar(255) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_fdb2f3ad8115da4c7718109a6e\` ON \`customer\` (\`email\`)`);
    }

}
