import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const databaseConfigPath =
  (process.env.JMA_SECRETS
    ? process.env.JMA_SECRETS + '/' + process.env.JMA_BUILD_TYPE
    : '/var/data/secrets/jma') + '/database.json';
const databaseConfig = require(databaseConfigPath);

export const dbConfigProduction = {
  name: 'db',
  connector: 'mysql',
  host: databaseConfig.server,
  user: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
};
export const dbConfigTest = {
  name: 'db',
  connector: 'memory',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'db';

  constructor(
    @inject('datasources.config.db', {optional: true})
    dsConfig: object,
  ) {
    super(dsConfig);
  }
}
