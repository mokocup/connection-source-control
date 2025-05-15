import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SchemaService } from './schema.service';

@Controller('schema')
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @Get(':sourceId')
  @ApiOperation({ summary: 'Get tables for a source connection' })
  @ApiParam({
    name: 'sourceId',
    type: 'integer',
    description: 'ID of the source connection',
  })
  async getTables(
    @Param('sourceId', ParseIntPipe) sourceId: number,
  ): Promise<string[]> {
    return this.schemaService.getTables(sourceId);
  }

  @Get(':sourceId/schema')
  @ApiOperation({ summary: 'Get the schema for a table' })
  @ApiParam({
    name: 'sourceId',
    type: 'integer',
    description: 'ID of the source connection',
  })
  @ApiQuery({
    name: 'tableName',
    type: 'string',
    description: 'Name of the table',
  })
  async getTableSchema(
    @Param('sourceId', ParseIntPipe) sourceId: number,
    @Query('tableName') tableName: string,
  ) {
    return this.schemaService.getTableSchema(sourceId, tableName);
  }
}
