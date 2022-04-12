import {repository} from '@loopback/repository';
import {
  AccountRepository,
  PushSubscriptionRepository,
  SessionHashRepository,
  SessionOtpRepository,
  StringRepository,
} from '../../repositories';

export class Repositories {
  public static BINDING = 'jma.repositories';

  public accountRepository: AccountRepository;
  public pushSubscriptionRepository: PushSubscriptionRepository;
  public sessionHashRepository: SessionHashRepository;
  public sessionOtpRepository: SessionOtpRepository;
  public stringRepository: StringRepository;

  constructor(
    @repository(AccountRepository) accountRepository: AccountRepository,
    @repository(PushSubscriptionRepository)
    pushSubscriptionRepository: PushSubscriptionRepository,
    @repository(SessionHashRepository)
    sessionHashRepository: SessionHashRepository,
    @repository(SessionOtpRepository)
    sessionOtpRepository: SessionOtpRepository,
    @repository(StringRepository) stringRepository: StringRepository,
  ) {
    this.accountRepository = accountRepository;
    this.pushSubscriptionRepository = pushSubscriptionRepository;
    this.sessionHashRepository = sessionHashRepository;
    this.sessionOtpRepository = sessionOtpRepository;
    this.stringRepository = stringRepository;
  }
}
