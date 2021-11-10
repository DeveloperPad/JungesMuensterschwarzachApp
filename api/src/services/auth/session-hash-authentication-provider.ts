import {AuthenticationStrategy} from '@loopback/authentication';
import {StrategyAdapter} from '@loopback/authentication-passport';
import {CoreBindings, inject, Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Strategy, VerifyFunctions} from 'passport-http-bearer';
import {
  AccountProfile,
  AccountWithRelations,
  SessionHashWithRelations,
} from '../../models';
import {SessionHashRepository} from '../../repositories';
import {securityId} from '@loopback/security';
import {Application} from '../..';

export const AUTHS = 'sessionHashBearer';

export class SessionHashAuthenticationProvider
  implements Provider<AuthenticationStrategy>
{
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: Application,
    @repository(SessionHashRepository)
    private sessionHashRepository: SessionHashRepository,
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
      [securityId]: user.accessLevel.toString(),
      userId: user.userId,
    });
  }
}
