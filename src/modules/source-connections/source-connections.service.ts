import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SourceConnection } from './entities/source-connection.entity';
import { Repository } from 'typeorm';
import { TestSourceDto } from './dto/test-source.dto';
import { ConnectionService } from '../connection/connection.service';
import { SupportedSourceConnectionType } from './source-connections.type';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

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

  async findAll(
    name?: string,
    hostname?: string,
    type?: SupportedSourceConnectionType,
  ): Promise<SourceConnection[]> {
    const where: FindOptionsWhere<SourceConnection> = {};
    if (name) {
      where.name = name;
    }
    if (hostname) {
      where.host = hostname;
    }
    if (type) {
      where.type = type;
    }
    return await this.sourceConnectionRepository.find({
      where,
    });
  }

  async findOne(id: number): Promise<SourceConnection> {
    const sourceConnection = await this.sourceConnectionRepository.findOneBy({
      id,
    });
    if (!sourceConnection) {
      throw new HttpException(
        'Source connection not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return sourceConnection;
  }

  async update(id: number, updateSourceConnectionDto: UpdateSourceDto) {
    const existingSource = await this.sourceConnectionRepository.findOneBy({
      id,
    });
    if (!existingSource) {
      throw new HttpException(
        'Source connection not found',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.testConnection({
      ...updateSourceConnectionDto,
      type: existingSource.type,
    });

    // Update entity and save.
    this.sourceConnectionRepository.merge(
      existingSource,
      updateSourceConnectionDto,
    );
    return this.sourceConnectionRepository.save(existingSource);
  }

  async remove(id: number) {
    const result = await this.sourceConnectionRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException(
        'Source connection not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async testConnection(testSourceDto: TestSourceDto) {
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
          error: e?.message as string,
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
