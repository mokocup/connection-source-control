import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SourceConnectionsModule } from './modules/source-connections/source-connections.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SchemaModule } from './modules/schema/schema.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // TODO: Convert this to Service and sync with typeORM CLI later when have time , fixed Config for now
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      // @ts-ignore
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
    }),
    SourceConnectionsModule,
    SchemaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
