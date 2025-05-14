import { MigrationInterface, QueryRunner } from "typeorm";

export class PasswordNonNullable1747257175649 implements MigrationInterface {
    name = 'PasswordNonNullable1747257175649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`source_connections\` CHANGE \`schema\` \`schema\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`source_connections\` CHANGE \`schema\` \`schema\` varchar(255) NULL DEFAULT 'NULL'`);
    }

}
