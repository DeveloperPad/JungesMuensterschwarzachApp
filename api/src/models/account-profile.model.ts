import {securityId, UserProfile} from '@loopback/security';

export class AccountProfile implements UserProfile {
  constructor(data?: Partial<AccountProfile>) {
    Object.assign(this, data);
  }

  [securityId]: string;
  userId: number;
}

export interface AccountProfileRelations {
  // describe navigational properties here
}

export type AccountProfileWithRelations = AccountProfile &
  AccountProfileRelations;
