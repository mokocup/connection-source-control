import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseSourceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    default: 'localhost',
  })
  host: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    minimum: 1,
    maximum: 65535,
    default: 3306,
  })
  port: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string;

  // @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  database: string;
}
