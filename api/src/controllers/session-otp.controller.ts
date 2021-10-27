import {authorize} from '@loopback/authorization';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Account, SessionOtp} from '../models';
import {SessionOtpRepository} from '../repositories';

@authorize({
  allowedRoles: ['DEVELOPER'],
})
export class SessionOtpController {
  constructor(
    @repository(SessionOtpRepository)
    public sessionOtpRepository: SessionOtpRepository,
  ) {}

  @post('/session-otps')
  @response(200, {
    description: 'SessionOtp model instance',
    content: {'application/json': {schema: getModelSchemaRef(SessionOtp)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SessionOtp, {
            title: 'NewSessionOtp',
          }),
        },
      },
    })
    sessionOtp: SessionOtp,
  ): Promise<SessionOtp> {
    return this.sessionOtpRepository.create(sessionOtp);
  }

  @get('/session-otps/count')
  @response(200, {
    description: 'SessionOtp model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SessionOtp) where?: Where<SessionOtp>,
  ): Promise<Count> {
    return this.sessionOtpRepository.count(where);
  }

  @get('/session-otps')
  @response(200, {
    description: 'Array of SessionOtp model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SessionOtp, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SessionOtp) filter?: Filter<SessionOtp>,
  ): Promise<SessionOtp[]> {
    return this.sessionOtpRepository.find(filter);
  }

  @patch('/session-otps')
  @response(200, {
    description: 'SessionOtp PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SessionOtp, {partial: true}),
        },
      },
    })
    sessionOtp: SessionOtp,
    @param.where(SessionOtp) where?: Where<SessionOtp>,
  ): Promise<Count> {
    return this.sessionOtpRepository.updateAll(sessionOtp, where);
  }

  @get('/session-otps/{id}')
  @response(200, {
    description: 'SessionOtp model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SessionOtp, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(SessionOtp, {exclude: 'where'})
    filter?: FilterExcludingWhere<SessionOtp>,
  ): Promise<SessionOtp> {
    return this.sessionOtpRepository.findById(id, filter);
  }

  @patch('/session-otps/{id}')
  @response(204, {
    description: 'SessionOtp PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SessionOtp, {partial: true}),
        },
      },
    })
    sessionOtp: SessionOtp,
  ): Promise<void> {
    await this.sessionOtpRepository.updateById(id, sessionOtp);
  }

  @put('/session-otps/{id}')
  @response(204, {
    description: 'SessionOtp PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() sessionOtp: SessionOtp,
  ): Promise<void> {
    await this.sessionOtpRepository.replaceById(id, sessionOtp);
  }

  @del('/session-otps/{id}')
  @response(204, {
    description: 'SessionOtp DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.sessionOtpRepository.deleteById(id);
  }

  // FOREIGN KEYS

  @get('/session-otps/{id}/account', {
    responses: {
      '200': {
        description: 'Account belonging to SessionOtp',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Account)},
          },
        },
      },
    },
  })
  async getAccount(
    @param.path.string('id') id: typeof SessionOtp.prototype.OTP,
  ): Promise<Account> {
    return this.sessionOtpRepository.account(id);
  }
}
