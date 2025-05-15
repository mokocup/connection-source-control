import { Injectable } from '@nestjs/common';
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
        details: { error: (error as Error).message },
      };
    }

    return {
      success: false,
      message: 'Method not found.',
    };
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

    if (!versionCheck) {
      return {
        success: false,
        message: 'MySQL Version Not Supported',
        details: { version, supported: '>=5.5 and < 6 or >= 8' },
      };
    }

    return {
      success: true,
      message: 'Connection successful, and version is supported.',
      details: { version },
    };
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

    if (!versionCheck) {
      return {
        success: false,
        message: 'PostgreSQL Version Not Supported',
        details: { version: versionString, supported: '>=10' },
      };
    }
    if (!hasCreatePrivilege) {
      return {
        success: false,
        message: 'User does not have CREATE privilege.',
      };
    }
    return {
      success: true,
      message: 'Connection successful, and version is supported.',
      details: { version: versionString },
    };
  }
}
