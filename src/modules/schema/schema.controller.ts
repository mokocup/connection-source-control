import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
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
}
