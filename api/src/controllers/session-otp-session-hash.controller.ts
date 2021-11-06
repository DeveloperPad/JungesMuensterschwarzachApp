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
import {SessionOtp, SessionHash} from '../models';
import {SessionOtpRepository} from '../repositories';

export class SessionOtpSessionHashController {
  constructor(
    @repository(SessionOtpRepository)
    protected sessionOtpRepository: SessionOtpRepository,
  ) {}

  @get('/session-otps/{id}/session-hashes', {
    responses: {
      '200': {
        description: 'Array of SessionOtp has many SessionHash',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(SessionHash)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<SessionHash>,
  ): Promise<SessionHash[]> {
    return this.sessionOtpRepository.sessionHashes(id).find(filter);
  }

  @post('/session-otps/{id}/session-hashes', {
    responses: {
      '200': {
        description: 'SessionOtp model instance',
        content: {'application/json': {schema: getModelSchemaRef(SessionHash)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof SessionOtp.prototype.OTP,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SessionHash, {
            title: 'NewSessionHashInSessionOtp',
            exclude: ['sessionHash'],
            optional: ['OTP'],
          }),
        },
      },
    })
    sessionHash: Omit<SessionHash, 'sessionHash'>,
  ): Promise<SessionHash> {
    return this.sessionOtpRepository.sessionHashes(id).create(sessionHash);
  }

  @patch('/session-otps/{id}/session-hashes', {
    responses: {
      '200': {
        description: 'SessionOtp.SessionHash PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SessionHash, {partial: true}),
        },
      },
    })
    sessionHash: Partial<SessionHash>,
    @param.query.object('where', getWhereSchemaFor(SessionHash))
    where?: Where<SessionHash>,
  ): Promise<Count> {
    return this.sessionOtpRepository
      .sessionHashes(id)
      .patch(sessionHash, where);
  }

  @del('/session-otps/{id}/session-hashes', {
    responses: {
      '200': {
        description: 'SessionOtp.SessionHash DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(SessionHash))
    where?: Where<SessionHash>,
  ): Promise<Count> {
    return this.sessionOtpRepository.sessionHashes(id).delete(where);
  }
}
