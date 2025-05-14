import { CreateSourceDto } from './create-source.dto';
import { BaseSourceDto } from './base-source.dto';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSourceDto extends BaseSourceDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string; // Allow updating the name

  // Get type from database instead of trust user payload
  @ValidateIf((o: CreateSourceDto) => !!o.type && o.type === 'postgresql')
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  schema?: string;
}
