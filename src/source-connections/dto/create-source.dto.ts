import { BaseSourceDto } from './base-source.dto';
import { IsIn, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateSourceDto extends BaseSourceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsIn(['mysql', 'postgresql'])
  type: 'mysql' | 'postgresql';

  // Required for PostgreSQL, not for MySQL
  @ValidateIf((o: CreateSourceDto) => o.type === 'postgresql')
  @IsNotEmpty()
  @IsString()
  schema?: string;
}
