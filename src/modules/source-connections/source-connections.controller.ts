import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { SourceConnectionsService } from './source-connections.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { TestSourceDto } from './dto/test-source.dto';
import { ConnectionService } from '../connection/connection.service';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SupportedSourceConnectionType } from './source-connections.type';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('source-connections')
export class SourceConnectionsController {
  constructor(
    private readonly sourceConnectionsService: SourceConnectionsService,
    private readonly databaseService: ConnectionService,
  ) {}

  @Post()
  async create(@Body() createSourceConnectionDto: CreateSourceDto) {
    // Ensure passwords are not included in responses.
    // Should use Interceptor with Class-transformer to filter the password but it overengineering for just one function
    return await this.sourceConnectionsService.create(
      createSourceConnectionDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all source connections' })
  @ApiQuery({
    name: 'name',
    type: 'string',
    required: false,
    description: 'Filter by source name',
  })
  @ApiQuery({
    name: 'hostname',
    type: 'string',
    required: false,
    description: 'Filter by source hostname',
  })
  @ApiQuery({
    name: 'type',
    enum: ['mysql', 'postgresql'],
    required: false,
    description: 'Filter by source type',
  })
  async findAll(
    @Query('name') name?: string,
    @Query('hostname') hostname?: string,
    @Query('type') type?: SupportedSourceConnectionType,
  ) {
    return this.sourceConnectionsService.findAll(name, hostname, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a source connection by ID' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID of the source connection',
  })
  @ApiQuery({
    name: 'name',
    type: 'string',
    required: false,
    description: 'Filter by source name',
  })
  @ApiQuery({
    name: 'hostname',
    type: 'string',
    required: false,
    description: 'Filter by source hostname',
  })
  @ApiQuery({
    name: 'type',
    enum: ['mysql', 'postgresql'],
    required: false,
    description: 'Filter by source type',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sourceConnectionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a source connection' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID of the source connection',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSourceConnectionDto: UpdateSourceDto,
  ) {
    // Ensure passwords are not included in responses.
    // Should use Interceptor with Class-transformer to filter the password but it overengineering for just one function
    return await this.sourceConnectionsService.update(
      +id,
      updateSourceConnectionDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a source connection' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID of the source connection',
  })
  async remove(@Param('id') id: string) {
    return this.sourceConnectionsService.remove(+id);
  }

  @Post('test')
  @ApiOperation({ summary: 'Test a source connection' })
  async testConnection(@Body() testSourceDto: TestSourceDto): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    return this.sourceConnectionsService.testConnection(testSourceDto);
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Test an existing source connection by ID' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'ID of the source connection',
  })
  async testConnectionById(@Param('id', ParseIntPipe) id: number): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    const source = await this.sourceConnectionsService.findOne(id);

    return this.sourceConnectionsService.testConnection(source);
  }
}
