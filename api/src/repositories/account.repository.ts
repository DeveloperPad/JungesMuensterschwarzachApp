import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Account, AccountRelations, SessionOtp} from '../models';
import {SessionOtpRepository} from './session-otp.repository';

export class AccountRepository extends DefaultCrudRepository<
  Account,
  typeof Account.prototype.userId,
  AccountRelations
> {

  public readonly sessionOtps: HasManyRepositoryFactory<SessionOtp, typeof Account.prototype.userId>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('SessionOtpRepository') protected sessionOtpRepositoryGetter: Getter<SessionOtpRepository>,
  ) {
    super(Account, dataSource);
    this.sessionOtps = this.createHasManyRepositoryFactoryFor('sessionOtps', sessionOtpRepositoryGetter,);
    this.registerInclusionResolver('sessionOtps', this.sessionOtps.inclusionResolver);
  }
}
