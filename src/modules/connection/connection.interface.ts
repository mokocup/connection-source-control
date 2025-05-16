import { SupportedSourceConnectionType } from '../source-connections/source-connections.type';

export interface SourceDetail {
  host: string;
  port: number;
  type: SupportedSourceConnectionType;
  username: string;
  password?: string;
  database: string;
  schema?: string;
}

export interface SourceData {
  [key: string]: any;
}
