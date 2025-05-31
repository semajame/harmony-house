import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedUserAndCustomer1748654365197 implements MigrationInterface {
    name = 'ModifiedUserAndCustomer1748654365197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop old foreign key
        await queryRunner.query(`ALTER TABLE \`reservation\` DROP FOREIGN KEY \`FK_7dce8a5a6907476eba30fedde91\``);

        // Drop the customer table
        await queryRunner.query(`DROP TABLE IF EXISTS \`customer\``);

        // Rename customerId to userId in reservation
        await queryRunner.query(`ALTER TABLE \`reservation\` CHANGE \`customerId\` \`userId\` int NULL`);

        // Add 'name' column and update role enum
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('admin', 'staff', 'customer') NOT NULL DEFAULT 'customer'`);

        // Add new foreign key constraint to user
        await queryRunner.query(`ALTER TABLE \`reservation\` ADD CONSTRAINT \`FK_529dceb01ef681127fef04d755d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop new foreign key
        await queryRunner.query(`ALTER TABLE \`reservation\` DROP FOREIGN KEY \`FK_529dceb01ef681127fef04d755d\``);

        // Revert role enum and drop name column
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('admin', 'staff', 'costumer') NOT NULL DEFAULT 'costumer'`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`name\``);

        // Revert userId to customerId in reservation
        await queryRunner.query(`ALTER TABLE \`reservation\` CHANGE \`userId\` \`customerId\` int NULL`);

        // Recreate the customer table
        await queryRunner.query(`
            CREATE TABLE \`customer\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`phone\` varchar(20),
                \`isActive\` tinyint NOT NULL DEFAULT 1,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

        // Restore the old foreign key
        await queryRunner.query(`ALTER TABLE \`reservation\` ADD CONSTRAINT \`FK_7dce8a5a6907476eba30fedde91\` FOREIGN KEY (\`customerId\`) REFERENCES \`customer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
