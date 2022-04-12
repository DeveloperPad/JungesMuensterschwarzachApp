import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {String, StringRelations} from '../models';

export class StringRepository extends DefaultCrudRepository<
  String,
  typeof String.prototype.identifier,
  StringRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(String, dataSource);
  }
}
