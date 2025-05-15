import { Module } from '@nestjs/common';
import { SchemaController } from './schema.controller';
import { SchemaService } from './schema.service';
import { ConnectionModule } from '../connection/connection.module';
import { SourceConnectionsModule } from '../source-connections/source-connections.module';
import { ConnectionService } from '../connection/connection.service';
import { SourceConnectionsService } from '../source-connections/source-connections.service';

@Module({
  imports: [ConnectionModule, SourceConnectionsModule],
  controllers: [SchemaController],
  providers: [SchemaService, ConnectionService, SourceConnectionsService],
})
export class SchemaModule {}
