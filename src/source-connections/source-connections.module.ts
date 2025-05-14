import { Module } from '@nestjs/common';
import { SourceConnectionsService } from './source-connections.service';
import { SourceConnectionsController } from './source-connections.controller';

@Module({
  controllers: [SourceConnectionsController],
  providers: [SourceConnectionsService],
})
export class SourceConnectionsModule {}
