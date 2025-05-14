import { Module } from '@nestjs/common';
import { SourceConnectionsService } from './source-connections.service';
import { SourceConnectionsController } from './source-connections.controller';
import { ConnectionModule } from '../connection/connection.module';
import { ConnectionService } from '../connection/connection.service';
import { SourceConnection } from './entities/source-connection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ConnectionModule, TypeOrmModule.forFeature([SourceConnection])],
  controllers: [SourceConnectionsController],
  providers: [SourceConnectionsService, ConnectionService],
})
export class SourceConnectionsModule {}
