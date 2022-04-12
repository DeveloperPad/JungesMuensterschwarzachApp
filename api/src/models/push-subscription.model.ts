import {Entity, model, property, belongsTo} from '@loopback/repository';
import {AccountWithRelations} from '.';
import {Account} from './account.model';

@model({
  name: 'account_push_subscriptions',
})
export class PushSubscription extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  endpoint: string;

  @property({
    type: 'string',
    required: true,
  })
  keyAuth: string;

  @property({
    type: 'string',
    required: true,
  })
  keyPub: string;

  @belongsTo(() => Account, {keyTo: 'userId', name: 'account'})
  userId?: number;

  constructor(data?: Partial<PushSubscription>) {
    super(data);
  }
}

export interface PushSubscriptionRelations {
  account: AccountWithRelations;
}

export type PushSubscriptionWithRelations = PushSubscription &
  PushSubscriptionRelations;
