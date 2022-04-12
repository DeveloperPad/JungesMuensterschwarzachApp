import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/context';
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
import {AccountProfile, SessionHash} from '../models';
import {SessionOtp} from '../models/session-otp.model';
import {AUTHS} from '../services/auth/session-hash-authentication-provider';
import {SessionHashRepository} from '../repositories';
import {SecurityBindings} from '@loopback/security';
import {authorize} from '@loopback/authorization';

@authenticate(AUTHS)
export class SessionHashController {
  constructor(
    @repository(SessionHashRepository)
    public sessionHashRepository: SessionHashRepository,
    @inject(SecurityBindings.USER) private account: AccountProfile,
  ) {}

  @post('/session-hashes')
  @response(200, {
    description: 'SessionHash model instance',
    content: {'application/json': {schema: getModelSchemaRef(SessionHash)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SessionHash, {
            title: 'NewSessionHash',
          }),
        },
      },
    })
    sessionHash: SessionHash,
  ): Promise<SessionHash> {
    return this.sessionHashRepository.create(sessionHash);
  }

  @get('/session-hashes/count')
  @response(200, {
    description: 'SessionHash model count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({
    resource: 'session-hash',
    scopes: ['count'],
  })
  async count(
    @param.where(SessionHash) where?: Where<SessionHash>,
  ): Promise<Count> {
    return this.sessionHashRepository.count(where);
  }

  @get('/session-hashes')
  @response(200, {
    description: 'Array of SessionHash model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SessionHash, {includeRelations: true}),
        },
      },
    },
  })
  @authorize({
    resource: 'session-hash',
    scopes: ['read'],
  })
  async find(
    @param.filter(SessionHash) filter?: Filter<SessionHash>,
  ): Promise<SessionHash[]> {
    return this.sessionHashRepository.find(filter);
  }

  @patch('/session-hashes')
  @response(200, {
    description: 'SessionHash PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SessionHash, {partial: true}),
        },
      },
    })
    sessionHash: SessionHash,
    @param.where(SessionHash) where?: Where<SessionHash>,
  ): Promise<Count> {
    return this.sessionHashRepository.updateAll(sessionHash, where);
  }

  @get('/session-hashes/{id}')
  @response(200, {
    description: 'SessionHash model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SessionHash, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(SessionHash, {exclude: 'where'})
    filter?: FilterExcludingWhere<SessionHash>,
  ): Promise<SessionHash> {
    return this.sessionHashRepository.findById(id, filter);
  }

  @patch('/session-hashes/{id}')
  @response(204, {
    description: 'SessionHash PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SessionHash, {partial: true}),
        },
      },
    })
    sessionHash: SessionHash,
  ): Promise<void> {
    await this.sessionHashRepository.updateById(id, sessionHash);
  }

  @put('/session-hashes/{id}')
  @response(204, {
    description: 'SessionHash PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() sessionHash: SessionHash,
  ): Promise<void> {
    await this.sessionHashRepository.replaceById(id, sessionHash);
  }

  @del('/session-hashes/{id}')
  @response(204, {
    description: 'SessionHash DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.sessionHashRepository.deleteById(id);
  }

  // FOREIGN KEYS

  @get('/session-hashes/{id}/session-otp', {
    responses: {
      '200': {
        description: 'SessionOtp belonging to SessionHash',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(SessionOtp)},
          },
        },
      },
    },
  })
  async getSessionOtp(
    @param.path.string('id') id: typeof SessionHash.prototype.sessionHash,
  ): Promise<SessionOtp> {
    return this.sessionHashRepository.sessionOtp(id);
  }
}
