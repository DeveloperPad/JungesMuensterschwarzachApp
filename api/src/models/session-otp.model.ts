import {
  Entity,
  model,
  property,
  hasMany,
  belongsTo,
} from '@loopback/repository';
import {SessionHash, SessionHashWithRelations} from './session-hash.model';
import {Account} from './account.model';
import {AccountWithRelations} from '.';

@model({
  name: 'account_session_otps',
})
export class SessionOtp extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  OTP: string;

  @property({
    type: 'date',
    required: true,
  })
  expires: string;

  @hasMany(() => SessionHash, {keyTo: 'OTP', name: 'sessionHashes'})
  sessionHashes: SessionHash[];

  @belongsTo(() => Account, {keyTo: 'userId', name: 'account'})
  userId: number;

  constructor(data?: Partial<SessionOtp>) {
    super(data);
  }
}

export interface SessionOtpRelations {
  sessionHashes: SessionHashWithRelations[];
  account: AccountWithRelations;
}

export type SessionOtpWithRelations = SessionOtp & SessionOtpRelations;
