import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
  BelongsToAccessor,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {SessionOtp, SessionOtpRelations, SessionHash, Account} from '../models';
import {SessionHashRepository} from './session-hash.repository';
import {AccountRepository} from './account.repository';

export class SessionOtpRepository extends DefaultCrudRepository<
  SessionOtp,
  typeof SessionOtp.prototype.OTP,
  SessionOtpRelations
> {
  public readonly sessionHashes: HasManyRepositoryFactory<
    SessionHash,
    typeof SessionOtp.prototype.OTP
  >;

  public readonly account: BelongsToAccessor<
    Account,
    typeof SessionOtp.prototype.OTP
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('SessionHashRepository')
    protected sessionHashRepositoryGetter: Getter<SessionHashRepository>,
    @repository.getter('AccountRepository')
    protected accountRepositoryGetter: Getter<AccountRepository>,
  ) {
    super(SessionOtp, dataSource);
    this.account = this.createBelongsToAccessorFor(
      'account',
      accountRepositoryGetter,
    );
    this.registerInclusionResolver('account', this.account.inclusionResolver);
    this.sessionHashes = this.createHasManyRepositoryFactoryFor(
      'sessionHashes',
      sessionHashRepositoryGetter,
    );
    this.registerInclusionResolver(
      'sessionHashes',
      this.sessionHashes.inclusionResolver,
    );
  }
}
