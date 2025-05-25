import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1748137753151 implements MigrationInterface {
    name = 'Init1748137753151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`room\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`capacity\` int NOT NULL, \`isAvailable\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`customer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(20) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` decimal(10,2) NOT NULL, \`method\` varchar(50) NOT NULL, \`paidAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reservation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`startTime\` datetime NOT NULL, \`endTime\` datetime NOT NULL, \`roomId\` int NULL, \`customerId\` int NULL, \`paymentId\` int NULL, UNIQUE INDEX \`REL_66f3317f7c28a8507ad8580540\` (\`paymentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`staff\` DROP COLUMN \`phone\``);
        await queryRunner.query(`ALTER TABLE \`staff\` ADD \`phone\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`reservation\` ADD CONSTRAINT \`FK_ee6959f2cbe32d030b5e58b45d7\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reservation\` ADD CONSTRAINT \`FK_7dce8a5a6907476eba30fedde91\` FOREIGN KEY (\`customerId\`) REFERENCES \`customer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reservation\` ADD CONSTRAINT \`FK_66f3317f7c28a8507ad8580540f\` FOREIGN KEY (\`paymentId\`) REFERENCES \`payment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reservation\` DROP FOREIGN KEY \`FK_66f3317f7c28a8507ad8580540f\``);
        await queryRunner.query(`ALTER TABLE \`reservation\` DROP FOREIGN KEY \`FK_7dce8a5a6907476eba30fedde91\``);
        await queryRunner.query(`ALTER TABLE \`reservation\` DROP FOREIGN KEY \`FK_ee6959f2cbe32d030b5e58b45d7\``);
        await queryRunner.query(`ALTER TABLE \`staff\` DROP COLUMN \`phone\``);
        await queryRunner.query(`ALTER TABLE \`staff\` ADD \`phone\` varchar(255) NULL`);
        await queryRunner.query(`DROP INDEX \`REL_66f3317f7c28a8507ad8580540\` ON \`reservation\``);
        await queryRunner.query(`DROP TABLE \`reservation\``);
        await queryRunner.query(`DROP TABLE \`payment\``);
        await queryRunner.query(`DROP TABLE \`customer\``);
        await queryRunner.query(`DROP TABLE \`room\``);
    }

}
