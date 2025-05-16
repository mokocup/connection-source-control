import { MigrationInterface, QueryRunner } from 'typeorm';

export class PasswordNullable1747380166754 implements MigrationInterface {
  name = 'PasswordNullable1747380166754';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`source_connections\` CHANGE \`schema\` \`schema\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`source_connections\` CHANGE \`schema\` \`schema\` varchar(255) NULL DEFAULT 'NULL'`,
    );
  }
}
