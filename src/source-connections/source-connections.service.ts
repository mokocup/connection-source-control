import { Injectable } from '@nestjs/common';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SourceConnection } from './entities/source-connection.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SourceConnectionsService {
  constructor(
    @InjectRepository(SourceConnection)
    private readonly sourceConnectionRepository: Repository<SourceConnection>,
  ) {}

  create(createSourceConnectionDto: CreateSourceDto) {
    return 'This action adds a new sourceConnection';
  }

  findAll() {
    return `This action returns all sourceConnections`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sourceConnection`;
  }

  update(id: number, updateSourceConnectionDto: UpdateSourceDto) {
    return `This action updates a #${id} sourceConnection`;
  }

  remove(id: number) {
    return `This action removes a #${id} sourceConnection`;
  }
}
