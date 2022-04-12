import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {PushSubscription, PushSubscriptionRelations, Account} from '../models';
import {AccountRepository} from './account.repository';

export class PushSubscriptionRepository extends DefaultCrudRepository<
  PushSubscription,
  typeof PushSubscription.prototype.endpoint,
  PushSubscriptionRelations
> {
  public readonly account: BelongsToAccessor<
    Account,
    typeof PushSubscription.prototype.endpoint
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('AccountRepository')
    protected accountRepositoryGetter: Getter<AccountRepository>,
  ) {
    super(PushSubscription, dataSource);
    this.account = this.createBelongsToAccessorFor(
      'account',
      accountRepositoryGetter,
    );
    this.registerInclusionResolver('account', this.account.inclusionResolver);
  }
}
