import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SourceConnectionsService } from './source-connections.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';

@Controller('source-connections')
export class SourceConnectionsController {
  constructor(
    private readonly sourceConnectionsService: SourceConnectionsService,
  ) {}

  @Post()
  create(@Body() createSourceConnectionDto: CreateSourceDto) {
    return this.sourceConnectionsService.create(createSourceConnectionDto);
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
}
