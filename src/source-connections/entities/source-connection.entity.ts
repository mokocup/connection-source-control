import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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
  type: 'mysql' | 'postgresql';

  @ApiProperty()
  @Column()
  host: string;

  @ApiProperty()
  @Column()
  port: number;

  @ApiProperty()
  @Column()
  username: string;

  @Column()
  password?: string; // Ensure passwords are masked or not included in responses, adhering to security best practices

  @ApiProperty()
  @Column()
  database: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  schema?: string; // For PostgreSQL
}
