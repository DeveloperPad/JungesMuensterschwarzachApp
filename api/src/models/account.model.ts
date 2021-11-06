import {Entity, model, property, hasMany} from '@loopback/repository';
import {SessionOtp, SessionOtpWithRelations} from './session-otp.model';

@model({
  name: 'account_data',
})
export class Account extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  userId?: number;

  @property({
    type: 'string',
    required: true,
  })
  displayName: string;

  @property({
    type: 'string',
  })
  firstName?: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'string',
    required: true,
  })
  eMailAddress: string;

  @property({
    type: 'string',
  })
  streetName?: string;

  @property({
    type: 'string',
  })
  houseNumber?: string;

  @property({
    type: 'string',
  })
  supplementaryAddress?: string;

  @property({
    type: 'string',
  })
  zipCode?: string;

  @property({
    type: 'string',
  })
  city?: string;

  @property({
    type: 'string',
  })
  country?: string;

  @property({
    type: 'string',
  })
  phoneNumber?: string;

  @property({
    type: 'date',
  })
  birthdate?: string;

  @property({
    type: 'string',
  })
  eatingHabits?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  allowPost: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  allowNewsletter: boolean;

  @property({
    type: 'string',
    hidden: true,
  })
  passwordHash?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isActivated: boolean;

  @property({
    type: 'number',
    default: 20,
  })
  accessLevel: number;

  @property({
    type: 'date',
    default: '$now',
  })
  registrationDate: string;

  @property({
    type: 'date',
    default: '$now',
  })
  modificationDate: string;

  @hasMany(() => SessionOtp, {keyTo: 'userId', name: 'sessionOtps'})
  sessionOtps: SessionOtp[];

  constructor(data?: Partial<Account>) {
    super(data);
  }
}

export interface AccountRelations {
  sessionOtps: SessionOtpWithRelations[];
}

export type AccountWithRelations = Account & AccountRelations;
