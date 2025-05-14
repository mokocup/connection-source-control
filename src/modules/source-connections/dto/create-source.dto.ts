import { BaseSourceDto } from './base-source.dto';
import { IsIn, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { SUPPORTED_SOURCE_CONNECTIONS } from '../../../constant/constant';
import { SupportedSourceConnectionType } from '../source-connections.type';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSourceDto extends BaseSourceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsIn(SUPPORTED_SOURCE_CONNECTIONS)
  @ApiProperty()
  type: SupportedSourceConnectionType;

  // Required for PostgreSQL, not for MySQL
  @ValidateIf((o: CreateSourceDto) => o.type === 'postgresql')
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  schema?: string;
}
