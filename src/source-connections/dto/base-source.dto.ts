import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class BaseSourceDto {
  @IsNotEmpty()
  @IsString()
  host: string;

  @IsNotEmpty()
  @IsInt()
  port: number;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  database: string;
}
