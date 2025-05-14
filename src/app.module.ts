import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SourceConnectionsModule } from './source-connections/source-connections.module';

@Module({
  imports: [SourceConnectionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
