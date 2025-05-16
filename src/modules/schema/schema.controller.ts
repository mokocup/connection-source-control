import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SchemaService } from './schema.service';
import { MinMaxPipe } from '../../common/pipes/min-max-validator.pipe';

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

  @Get(':sourceId/:tableName/schema')
  @ApiOperation({ summary: 'Get the schema for a table' })
  @ApiParam({
    name: 'sourceId',
    type: 'integer',
    description: 'ID of the source connection',
  })
  @ApiParam({
    name: 'tableName',
    type: 'string',
    description: 'Name of the table',
  })
  async getTableSchema(
    @Param('sourceId', ParseIntPipe) sourceId: number,
    @Param('tableName') tableName: string,
  ) {
    return this.schemaService.getTableSchema(sourceId, tableName);
  }

  @Get(':sourceId/:tableName/data')
  @ApiOperation({ summary: 'Get sample data from a table' })
  @ApiParam({
    name: 'sourceId',
    type: 'integer',
    description: 'ID of the source connection',
  })
  @ApiParam({
    name: 'tableName',
    type: 'string',
    description: 'Name of the table',
  })
  @ApiQuery({
    name: 'limit',
    type: 'integer',
    description: 'Maximum number of rows to return (default 10, max 100)',
    required: false,
  })
  async getSampleData(
    @Param('sourceId', ParseIntPipe) sourceId: number,
    @Param('tableName') tableName: string,
    @Query('limit', new MinMaxPipe({ min: 1, max: 100 })) limit: number = 10,
  ) {
    return this.schemaService.getSampleData(sourceId, tableName, limit);
  }
}
