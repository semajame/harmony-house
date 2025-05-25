import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedStatusOnReservationAndModifiedStaffRole1748183207527 implements MigrationInterface {
    name = 'AddedStatusOnReservationAndModifiedStaffRole1748183207527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reservation\` ADD \`status\` enum ('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE \`staff\` CHANGE \`role\` \`role\` enum ('admin', 'staff') NOT NULL DEFAULT 'staff'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`staff\` CHANGE \`role\` \`role\` enum ('admin', 'manager', 'receptionist') NOT NULL DEFAULT 'receptionist'`);
        await queryRunner.query(`ALTER TABLE \`reservation\` DROP COLUMN \`status\``);
    }

}
