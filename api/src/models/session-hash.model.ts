import {Entity, model, property, belongsTo} from '@loopback/repository';
import {SessionOtp, SessionOtpWithRelations} from './session-otp.model';

@model({
  name: 'account_session_hashs',
  settings: {
    scope: {
      // include: ["sessionOtp"]
    },
  },
})
export class SessionHash extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  sessionHash: string;

  @property({
    type: 'date',
    required: true,
  })
  expires: string;

  @belongsTo(() => SessionOtp, {keyTo: 'OTP', name: 'sessionOtp'})
  OTP: string;

  constructor(data?: Partial<SessionHash>) {
    super(data);
  }
}

export interface SessionHashRelations {
  sessionOtp: SessionOtpWithRelations;
}

export type SessionHashWithRelations = SessionHash & SessionHashRelations;
