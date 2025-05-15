import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TestSourceDto } from '../source-connections/dto/test-source.dto';
import { createConnection } from 'mysql2/promise';
import { SUPPORTED_SOURCE_CONNECTIONS } from '../../constant/constant';
import { Client as PostgresClient } from 'pg';
import * as format from 'pg-format';

@Injectable()
export class ConnectionService {
  async testConnection(config: TestSourceDto): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    if (!SUPPORTED_SOURCE_CONNECTIONS.includes(config.type)) {
      return {
        success: false,
        message: 'Connection type not allowed.',
      };
    }
    try {
      if (config.type === 'mysql') {
        return await this._testConnectionMySql(config);
      }
      if (config.type === 'postgresql') {
        return await this._testConnectionPostgresql(config);
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'Connection failed.',
        details: {
          canConnect: false,
          error: (error as Error).message,
        },
      };
    }

    return {
      success: false,
      message: 'Method not found.',
      details: {
        canConnect: false,
      },
    };
  }

  async getTables(config: TestSourceDto): Promise<string[]> {
    if (!SUPPORTED_SOURCE_CONNECTIONS.includes(config.type)) {
      throw new HttpException(
        `Connection type not allowed`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    try {
      if (config.type === 'mysql') {
        return await this._getTablesMySql(config);
      }
      if (config.type === 'postgresql') {
        return await this._getTablesPostgresql(config);
      }
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve tables: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return [];
  }

  async _getTableSchemaMySql(config: TestSourceDto, tableName: string) {
    const connection = await createConnection({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
    });
    const [results] = await connection.query('DESCRIBE ??', tableName);
    await connection.end();
    return (results as unknown as { [key: string]: string }[]).map((row) => ({
      columnName: row.Field,
      dataType: row.Type,
      isPrimaryKey: row.Key === 'PRI',
    }));
  }

  async _getTableSchemaPosgresql(config: TestSourceDto, tableName: string) {
    const client = new PostgresClient({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
    });
    await client.connect();
    const query_column = format(
      `SELECT column_name,
              data_type,
              null as constraint_type
       FROM information_schema.columns
       WHERE table_schema = %L
         AND table_name = %L`,
      config.schema,
      tableName,
    );

    const query_pk_column = format(
      `SELECT c.column_name, c.data_type, tc.constraint_type
       FROM information_schema.table_constraints tc
              JOIN information_schema.constraint_column_usage AS ccu
                   USING (constraint_schema, constraint_name)
              JOIN information_schema.columns AS c ON c.table_schema = tc.constraint_schema
         AND tc.table_name = c.table_name AND ccu.column_name = c.column_name
       WHERE constraint_type = 'PRIMARY KEY'
         and c.table_schema = %L
         and tc.table_name = %L;`,
      config.schema,
      tableName,
    );
    const result = await client.query(
      `${query_column} union ${query_pk_column}`,
    );
    await client.end();
    return result.rows.map((row) => {
      return {
        columnName: row.column_name,
        dataType: row.data_type,
        isPrimaryKey: row.constraint_type === 'PRIMARY KEY',
      };
    });
  }

  async getTableSchema(config: TestSourceDto, tableName: string) {
    if (!SUPPORTED_SOURCE_CONNECTIONS.includes(config.type)) {
      throw new HttpException(
        `Connection type not allowed`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    try {
      if (config.type === 'mysql') {
        return await this._getTableSchemaMySql(config, tableName);
      }
      if (config.type === 'postgresql') {
        return await this._getTableSchemaPosgresql(config, tableName);
      }
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve tables: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return [];
  }

  async getSampleData(
    config: TestSourceDto,
    tableName: string,
    limit: number,
  ): Promise<any[]> {
    if (!SUPPORTED_SOURCE_CONNECTIONS.includes(config.type)) {
      throw new HttpException(
        `Connection type not allowed`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    try {
      if (config.type === 'mysql') {
        return await this._getSampleDataMySql(config, tableName, limit);
      }
      if (config.type === 'postgresql') {
        return await this._getSampleDataPosgresql(config, tableName, limit);
      }
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve tables: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return [];
  }

  async _getSampleDataMySql(
    config: TestSourceDto,
    tableName: string,
    limit: number,
  ) {
    const connection = await createConnection({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
    });
    const [results] = await connection.query('SELECT * FROM ?? LIMIT ?', [
      tableName,
      limit,
    ]);
    await connection.end();
    return results as any[];
  }

  async _getSampleDataPosgresql(
    config: TestSourceDto,
    tableName: string,
    limit: number,
  ) {
    const client = new PostgresClient({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
    });
    await client.connect();
    const query = format(
      `SELECT *
       FROM %I LIMIT %s`,
      `${config.schema}.${tableName}`,
      limit,
    );
    const result = await client.query(query);
    await client.end();
    return result.rows;
  }

  private async _testConnectionMySql(config: TestSourceDto) {
    const connection = await createConnection({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
    });
    const versionResult = await connection.query('SELECT VERSION()');
    const versionString = versionResult?.[0]?.[0]?.['VERSION()'];

    if (!versionString) {
      return {
        success: false,
        message: 'Unknown MySQL Version',
      };
    }

    const version = parseFloat(versionString.split('.').slice(0, 2).join('.')); // Get Major.Minor

    const versionCheck = version >= 5.5 && (version >= 8 || version < 6); //simplified version check
    await connection.end();

    const results = {
      success: true,
      message: 'Connection successful',
      details: {
        canConnect: true,
        versionSupported: true,
      },
    };
    if (!versionCheck) {
      Object.assign(results, {
        success: false,
        message: 'MySQL Version Not Supported',
        details: {
          ...results,
          versionSupported: false,
        },
      });
    }

    return results;
  }

  private async _checkCreatePrivilegesPostgreSQL(
    client: PostgresClient,
    databaseName: string,
    schemaName?: string,
  ): Promise<boolean> {
    try {
      const query = format(
        "select has_database_privilege(%L, %L, 'CREATE') AS db_create,has_schema_privilege(%L, %L, 'CREATE') AS schema_create from information_schema.schemata WHERE schema_name = %L ;",
        client.user,
        databaseName,
        client.user,
        schemaName,
        schemaName,
      );
      const result = await client.query(query);

      if (result.rows && result.rows.length > 0) {
        const row = result.rows[0];
        return row.db_create || row.schema_create;
      }
      return false;
    } catch (error) {
      return false; // err on the side of caution.
    }
  }

  private async _testConnectionPostgresql(config: TestSourceDto) {
    // // TODO: Sanitized Schema Name since it send directly to config
    // const sanitizedSchema = config.schema;
    const client = new PostgresClient({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      // options: `-c search_path=${sanitizedSchema}`,
      database: config.database,
    });
    await client.connect();

    const versionResult = await client.query('SHOW server_version');
    const versionString = versionResult?.rows[0]?.server_version;

    if (!versionString) {
      return {
        success: false,
        message: 'PostgreSQL Version Not Supported',
      };
    }

    const versionNumber = parseInt(versionString.split('.').shift(), 10);
    const versionCheck = versionNumber >= 10;

    const hasCreatePrivilege = await this._checkCreatePrivilegesPostgreSQL(
      client,
      config.database,
      config.schema,
    );

    await client.end();

    const results = {
      success: true,
      message: 'Connection successful',
      details: {
        canConnect: true,
        versionSupported: true,
        hasCreatePrivilege: true,
      },
    };
    if (!versionCheck) {
      Object.assign(results, {
        success: false,
        message: 'PostgreSQL Version Not Supported',
        details: {
          ...results,
          versionSupported: false,
        },
      });
    }

    if (!hasCreatePrivilege) {
      Object.assign(results, {
        success: false,
        message: 'User does not have CREATE privilege',
        details: {
          ...results,
          hasCreatePrivilege: false,
        },
      });
    }

    return results;
  }

  private async _getTablesMySql(config: TestSourceDto) {
    const connection = await createConnection({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
    });
    const [results] = await connection.query('SHOW TABLES');
    await connection.end();
    // Data return in Array Object type Key_DBName:Value. Need map out to get real table name
    // Since we fetch table of a database, the key is same for every table , just need get first one as key
    const tableNameKey = Object.keys(results[0])[0];
    return (results as unknown as { [key: string]: string }[]).map(
      (row) => row[tableNameKey],
    );
  }

  private async _getTablesPostgresql(config: TestSourceDto) {
    const client = new PostgresClient({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
    });
    await client.connect();
    const query = format(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = %L AND table_type = 'BASE TABLE'`,
      config.schema,
    );
    const result = await client.query(query);
    await client.end();
    return result.rows.map((row) => row.table_name);
  }
}
