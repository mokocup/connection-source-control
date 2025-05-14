import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SourceConnectionsService } from './source-connections.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { TestSourceDto } from './dto/test-source.dto';
import { ConnectionService } from '../connection/connection.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('source-connections')
export class SourceConnectionsController {
  constructor(
    private readonly sourceConnectionsService: SourceConnectionsService,
    private readonly databaseService: ConnectionService,
  ) {}

  @Post()
  async create(@Body() createSourceConnectionDto: CreateSourceDto) {
    const result = await this.sourceConnectionsService.create(
      createSourceConnectionDto,
    );
    // Ensure passwords are not included in responses.
    // Should use Interceptor with Class-transformer to filter the password but it overengineering for just one function
    return { ...result, password: undefined };
  }

  @Get()
  findAll() {
    return this.sourceConnectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sourceConnectionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSourceConnectionDto: UpdateSourceDto,
  ) {
    return this.sourceConnectionsService.update(+id, updateSourceConnectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
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

  // @Post(':id/test')
  // @ApiOperation({ summary: 'Test an existing source connection by ID' })
  // @ApiParam({
  //   name: 'id',
  //   type: 'integer',
  //   description: 'ID of the source connection',
  // })
  // testConnectionById(@Param('id', ParseIntPipe) id: number): Promise<{
  //   success: boolean;
  //   message: string;
  //   details?: any;
  // }> {
  //   const source = await this.sourceConnectionsService.findOne(id);
  //
  //   const connectionDetails = {
  //     host: source.host,
  //     port: source.port,
  //     username: source.username,
  //     password: source.password,
  //     database: source.database,
  //     schema: source.schema,
  //   };
  //   return this.sourceConnectionsService.testConnection(connectionDetails);
  // }
}
