import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'strings',
})
export class String extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  identifier: string;

  @property({
    type: 'string',
    required: true,
  })
  en: string;

  @property({
    type: 'string',
    required: true,
  })
  de: string;

  constructor(data?: Partial<String>) {
    super(data);
  }
}

export interface StringRelations {
  // describe navigational properties here
}

export type StringWithRelations = String & StringRelations;
