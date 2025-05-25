import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1748138600418 implements MigrationInterface {
    name = 'Init1748138600418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`room\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`capacity\` int NOT NULL, \`isAvailable\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`customer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(20) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` decimal(10,2) NOT NULL, \`method\` varchar(50) NOT NULL, \`paidAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reservation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`startTime\` datetime NOT NULL, \`endTime\` datetime NOT NULL, \`roomId\` int NULL, \`customerId\` int NULL, \`paymentId\` int NULL, UNIQUE INDEX \`REL_66f3317f7c28a8507ad8580540\` (\`paymentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`staff\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`phone\` varchar(20) NULL, UNIQUE INDEX \`IDX_35aafb5ad218f3ff1ff70e281e\` (\`username\`), UNIQUE INDEX \`IDX_902985a964245652d5e3a0f5f6\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`reservation\` ADD CONSTRAINT \`FK_ee6959f2cbe32d030b5e58b45d7\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reservation\` ADD CONSTRAINT \`FK_7dce8a5a6907476eba30fedde91\` FOREIGN KEY (\`customerId\`) REFERENCES \`customer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reservation\` ADD CONSTRAINT \`FK_66f3317f7c28a8507ad8580540f\` FOREIGN KEY (\`paymentId\`) REFERENCES \`payment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reservation\` DROP FOREIGN KEY \`FK_66f3317f7c28a8507ad8580540f\``);
        await queryRunner.query(`ALTER TABLE \`reservation\` DROP FOREIGN KEY \`FK_7dce8a5a6907476eba30fedde91\``);
        await queryRunner.query(`ALTER TABLE \`reservation\` DROP FOREIGN KEY \`FK_ee6959f2cbe32d030b5e58b45d7\``);
        await queryRunner.query(`DROP INDEX \`IDX_902985a964245652d5e3a0f5f6\` ON \`staff\``);
        await queryRunner.query(`DROP INDEX \`IDX_35aafb5ad218f3ff1ff70e281e\` ON \`staff\``);
        await queryRunner.query(`DROP TABLE \`staff\``);
        await queryRunner.query(`DROP INDEX \`REL_66f3317f7c28a8507ad8580540\` ON \`reservation\``);
        await queryRunner.query(`DROP TABLE \`reservation\``);
        await queryRunner.query(`DROP TABLE \`payment\``);
        await queryRunner.query(`DROP TABLE \`customer\``);
        await queryRunner.query(`DROP TABLE \`room\``);
    }

}
