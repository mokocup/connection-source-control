import { PartialType } from '@nestjs/mapped-types';
import { CreateSourceDto } from './create-source.dto';
import { BaseSourceDto } from './base-source.dto';
import {
  IsEmpty,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpdateSourceDto extends BaseSourceDto {
  @IsOptional()
  @IsString()
  name?: string; // Allow updating the name

  // Get type from database instead of trust user payload
  @ValidateIf((o: CreateSourceDto) => !!o.type && o.type === 'postgresql')
  @IsNotEmpty()
  @IsString()
  schema?: string;
}
