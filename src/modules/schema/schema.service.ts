import { Injectable } from '@nestjs/common';
import { SourceConnectionsService } from '../source-connections/source-connections.service';
import { ConnectionService } from '../connection/connection.service';

@Injectable()
export class SchemaService {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly sourceConnectionsService: SourceConnectionsService,
  ) {}

  async getTables(sourceId: number): Promise<string[]> {
    const source = await this.sourceConnectionsService.findOne(sourceId);
    // @ts-ignore
    return this.connectionService.getTables(source);
  }

  async getTableSchema(sourceId: number, tableName: string) {
    const source = await this.sourceConnectionsService.findOne(sourceId); // Use service
    // @ts-ignore
    return this.connectionService.getTableSchema(source, tableName);
  }

  async getSampleData(sourceId: number, tableName: string, limit: number) {
    const source = await this.sourceConnectionsService.findOne(sourceId); // Use service
    // @ts-ignore
    return this.connectionService.getSampleData(source, tableName, limit);
  }
}
