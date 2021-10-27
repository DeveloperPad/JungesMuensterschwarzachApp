import {AuthenticationStrategy} from '@loopback/authentication';
import {StrategyAdapter} from '@loopback/authentication-passport';
import {Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Strategy, VerifyFunctions} from 'passport-http-bearer';
import {
  AccountProfile,
  AccountWithRelations,
  SessionHashWithRelations,
} from '../../models';
import {AccountRepository, SessionHashRepository} from '../../repositories';
import {securityId} from '@loopback/security';

export const AUTHS = 'sessionHashBearer';

export class SessionHashAuthenticationProvider
  implements Provider<AuthenticationStrategy>
{
  constructor(
    @repository(SessionHashRepository)
    public sessionHashRepository: SessionHashRepository,
    @repository(AccountRepository)
    public accountRepository: AccountRepository,
  ) {}

  value(): AuthenticationStrategy {
    const strategy = this.createStrategy();
    return this.strategyToStrategyAdapter(strategy);
  }

  createStrategy(): Strategy<VerifyFunctions> {
    return new Strategy((token, done) => {
      this.sessionHashRepository
        .findById(token, {
          include: [
            {
              relation: 'sessionOtp',
              scope: {
                include: [{relation: 'account'}],
              },
            },
          ],
        })
        .then((sessionHash: SessionHashWithRelations) => {
          done(null, sessionHash.sessionOtp.account);
        })
        .catch(error => {
          done('SessionHash invalid', false);
        });
    });
  }

  strategyToStrategyAdapter(
    strategy: Strategy<VerifyFunctions>,
  ): AuthenticationStrategy {
    return new StrategyAdapter(strategy, AUTHS, this.accountToAccountProfile);
  }

  accountToAccountProfile(user: AccountWithRelations): AccountProfile {
    return new AccountProfile({
      [securityId]: <string>(<any>user.accessLevel),
      userId: user.userId,
    });
  }
}
