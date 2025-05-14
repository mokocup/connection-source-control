import { PartialType } from '@nestjs/mapped-types';
import { CreateSourceDto } from './create-source.dto';
import { BaseSourceDto } from './base-source.dto';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { SUPPORTED_SOURCE_CONNECTIONS } from '../../../constant/constant';
import { SupportedSourceConnectionType } from '../source-connections.type';
import { ApiProperty } from '@nestjs/swagger';

export class TestSourceDto extends BaseSourceDto {
  @IsNotEmpty()
  @IsIn(SUPPORTED_SOURCE_CONNECTIONS)
  @ApiProperty()
  type: SupportedSourceConnectionType;

  // Required for PostgreSQL, not for MySQL
  @ValidateIf((o: CreateSourceDto) => o.type === 'postgresql')
  @IsOptional()
  @IsString()
  @ApiProperty()
  schema?: string;
}
