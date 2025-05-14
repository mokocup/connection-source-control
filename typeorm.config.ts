import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'mysql',
  host: `${process.env.DATABASE_HOST}`,
  port: `${process.env.DATABASE_PORT}`,
  username: `${process.env.DATABASE_USERNAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities: ['./src/modules/**/*.entity{.ts,.js}'],
  migrations: ['./src/database/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
  logging: true,
};

const datasource = new DataSource(config as DataSourceOptions);
datasource.initialize();
export default datasource;
