import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {
  Account,
  AccountRelations,
  SessionOtp,
  PushSubscription,
} from '../models';
import {SessionOtpRepository} from './session-otp.repository';
import {PushSubscriptionRepository} from './push-subscription.repository';

export class AccountRepository extends DefaultCrudRepository<
  Account,
  typeof Account.prototype.userId,
  AccountRelations
> {
  public readonly sessionOtps: HasManyRepositoryFactory<
    SessionOtp,
    typeof Account.prototype.userId
  >;

  public readonly pushSubscriptions: HasManyRepositoryFactory<
    PushSubscription,
    typeof Account.prototype.userId
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('SessionOtpRepository')
    protected sessionOtpRepositoryGetter: Getter<SessionOtpRepository>,
    @repository.getter('PushSubscriptionRepository')
    protected pushSubscriptionRepositoryGetter: Getter<PushSubscriptionRepository>,
  ) {
    super(Account, dataSource);
    this.pushSubscriptions = this.createHasManyRepositoryFactoryFor(
      'pushSubscriptions',
      pushSubscriptionRepositoryGetter,
    );
    this.registerInclusionResolver(
      'pushSubscriptions',
      this.pushSubscriptions.inclusionResolver,
    );
    this.sessionOtps = this.createHasManyRepositoryFactoryFor(
      'sessionOtps',
      sessionOtpRepositoryGetter,
    );
    this.registerInclusionResolver(
      'sessionOtps',
      this.sessionOtps.inclusionResolver,
    );
  }
}
