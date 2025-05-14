import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1747251470810 implements MigrationInterface {
    name = 'InitDatabase1747251470810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`source_connections\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`host\` varchar(255) NOT NULL, \`port\` int NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`database\` varchar(255) NOT NULL, \`schema\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`source_connections\``);
    }

}
