import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {SessionHash, SessionHashRelations, SessionOtp} from '../models';
import {SessionOtpRepository} from './session-otp.repository';

export class SessionHashRepository extends DefaultCrudRepository<
  SessionHash,
  typeof SessionHash.prototype.sessionHash,
  SessionHashRelations
> {
  public readonly sessionOtp: BelongsToAccessor<
    SessionOtp,
    typeof SessionHash.prototype.sessionHash
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('SessionOtpRepository')
    protected sessionOtpRepositoryGetter: Getter<SessionOtpRepository>,
  ) {
    super(SessionHash, dataSource);
    this.sessionOtp = this.createBelongsToAccessorFor(
      'sessionOtp',
      sessionOtpRepositoryGetter,
    );
    this.registerInclusionResolver(
      'sessionOtp',
      this.sessionOtp.inclusionResolver,
    );
  }
}
