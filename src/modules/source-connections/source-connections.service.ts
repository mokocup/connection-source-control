import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SourceConnection } from './entities/source-connection.entity';
import { Repository } from 'typeorm';
import { TestSourceDto } from './dto/test-source.dto';
import { ConnectionService } from '../connection/connection.service';

@Injectable()
export class SourceConnectionsService {
  constructor(
    @InjectRepository(SourceConnection)
    private readonly sourceConnectionRepository: Repository<SourceConnection>,
    private readonly databaseService: ConnectionService,
  ) {}

  async create(createSourceConnectionDto: CreateSourceDto) {
    // Alway check source before save to make sure it valid source.
    await this.testConnection(createSourceConnectionDto);

    const sourceConnection = this.sourceConnectionRepository.create(
      createSourceConnectionDto,
    );
    return this.sourceConnectionRepository.save(sourceConnection);
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

  async testConnection(testSourceDto: TestSourceDto): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    let result: {
      success: boolean;
      message: string;
      details?: any;
    };
    try {
      result = await this.databaseService.testConnection(testSourceDto);
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: e?.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: e,
        },
      );
    }

    // TODO: Maybe split error handling response depend onn result, need custom exception throw from ConnectionService
    if (!result.success) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          ...result,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return result;
  }
}
