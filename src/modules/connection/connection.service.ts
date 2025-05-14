import { Injectable } from '@nestjs/common';
import { TestSourceDto } from '../source-connections/dto/test-source.dto';
import { createConnection } from 'mysql2/promise';
import { SUPPORTED_SOURCE_CONNECTIONS } from '../../constant/constant';

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
    const versionString = versionResult[0][0]['VERSION()'];
    const version = parseFloat(versionString.split('.').slice(0, 2).join('.')); // Get Major.Minor

    const versionCheck = version >= 5.5 && (version >= 8 || version < 6); //simplified version check
    //const versionCheck = version >= 8 || (version >= 5.5 && version < 6); // Original version check
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

  private async _testConnectionPostgresql(config: TestSourceDto) {}
}
