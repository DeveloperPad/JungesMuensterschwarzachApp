import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Account,
  SessionOtp,
} from '../models';
import {AccountRepository} from '../repositories';

export class AccountSessionOtpController {
  constructor(
    @repository(AccountRepository) protected accountRepository: AccountRepository,
  ) { }

  @get('/accounts/{id}/session-otps', {
    responses: {
      '200': {
        description: 'Array of Account has many SessionOtp',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(SessionOtp)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<SessionOtp>,
  ): Promise<SessionOtp[]> {
    return this.accountRepository.sessionOtps(id).find(filter);
  }

  @post('/accounts/{id}/session-otps', {
    responses: {
      '200': {
        description: 'Account model instance',
        content: {'application/json': {schema: getModelSchemaRef(SessionOtp)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Account.prototype.userId,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SessionOtp, {
            title: 'NewSessionOtpInAccount',
            exclude: ['OTP'],
            optional: ['userId']
          }),
        },
      },
    }) sessionOtp: Omit<SessionOtp, 'OTP'>,
  ): Promise<SessionOtp> {
    return this.accountRepository.sessionOtps(id).create(sessionOtp);
  }

  @patch('/accounts/{id}/session-otps', {
    responses: {
      '200': {
        description: 'Account.SessionOtp PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SessionOtp, {partial: true}),
        },
      },
    })
    sessionOtp: Partial<SessionOtp>,
    @param.query.object('where', getWhereSchemaFor(SessionOtp)) where?: Where<SessionOtp>,
  ): Promise<Count> {
    return this.accountRepository.sessionOtps(id).patch(sessionOtp, where);
  }

  @del('/accounts/{id}/session-otps', {
    responses: {
      '200': {
        description: 'Account.SessionOtp DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(SessionOtp)) where?: Where<SessionOtp>,
  ): Promise<Count> {
    return this.accountRepository.sessionOtps(id).delete(where);
  }

}
