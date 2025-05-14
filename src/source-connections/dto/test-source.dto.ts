import { PartialType } from '@nestjs/mapped-types';
import { CreateSourceDto } from './create-source.dto';
import { BaseSourceDto } from './base-source.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSourceConnectionDto extends BaseSourceDto {
  @IsOptional()
  @IsString()
  schema?: string;
}
