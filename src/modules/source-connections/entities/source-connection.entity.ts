import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SupportedSourceConnectionType } from '../source-connections.type';
import { Exclude } from 'class-transformer';

@Entity('source_connections')
export class SourceConnection {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  type: SupportedSourceConnectionType;

  @ApiProperty()
  @Column()
  host: string;

  @ApiProperty()
  @Column()
  port: number;

  @ApiProperty()
  @Column()
  username: string;

  @Column({ nullable: false })
  @Exclude()
  password?: string;

  @ApiProperty()
  @Column()
  database: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  schema?: string; // For PostgreSQL
}
