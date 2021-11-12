import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {Filter, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {Account, PushSubscription} from '../models';
import {PushSubscriptionRepository} from '../repositories';
import {AUTHS} from '../services/auth/session-hash-authentication-provider';
import {ownAccountVoter} from '../services/auth/voters/own-account';

export class PushSubscriptionController {
  constructor(
    @repository(PushSubscriptionRepository)
    public pushSubscriptionRepository: PushSubscriptionRepository,
  ) {}

  // admin

  @get('/push-subscriptions')
  @authenticate(AUTHS)
  @authorize({
    resource: 'push_subscriptions',
    scopes: ['admin'],
  })
  @response(200, {
    description: 'Array of PushSubscription model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PushSubscription),
        },
      },
    },
  })
  async findAll(
    @param.filter(PushSubscription) filter?: Filter<PushSubscription>,
  ): Promise<PushSubscription[]> {
    return this.pushSubscriptionRepository.find(filter);
  }

  // guests

  @post('/push-subscriptions')
  @response(200, {
    description: 'PushSubscription model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(PushSubscription)},
    },
  })
  async createGuest(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PushSubscription, {
            title: 'NewPushSubscription',
          }),
        },
      },
    })
    pushSubscription: PushSubscription,
  ): Promise<PushSubscription> {
    // guests may not set a userId
    delete pushSubscription.userId;
    return this.pushSubscriptionRepository.create(pushSubscription);
  }

  @del('/push-subscriptions/{endpoint}')
  @response(204, {
    description: 'PushSubscription DELETE success',
  })
  async deleteGuestById(
    @param.path.string('endpoint')
    endpoint: typeof PushSubscription.prototype.endpoint,
  ): Promise<void> {
    const pushSubscription = await this.pushSubscriptionRepository.findById(
      endpoint,
    );
    if (pushSubscription.userId !== undefined) {
      throw new HttpErrors.Forbidden(
        'Cannot delete push subscription of registered user!',
      );
    }
    await this.pushSubscriptionRepository.deleteById(endpoint);
  }

  // registered users

  @post('/accounts/{userId}/push-subscriptions')
  @response(200, {
    description: 'PushSubscription model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(PushSubscription)},
    },
  })
  @authenticate(AUTHS)
  @authorize({
    resource: 'push_subscriptions',
    scopes: ['user'],
    voters: [ownAccountVoter],
  })
  async createUser(
    @param.path.number('userId') userId: typeof Account.prototype.userId,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PushSubscription, {
            title: 'NewPushSubscription',
          }),
        },
      },
    })
    pushSubscription: PushSubscription,
  ): Promise<PushSubscription> {
    if (userId !== pushSubscription.userId) {
      throw new HttpErrors.Forbidden(
        'Cannot create push subscription with foreign userId!',
      );
    }
    return this.pushSubscriptionRepository.create(pushSubscription);
  }

  @get('/accounts/{userId}/push-subscriptions', {
    responses: {
      '200': {
        description: 'Array of Account has many PushSubscription',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PushSubscription)},
          },
        },
      },
    },
  })
  async findUser(
    @param.path.number('userId') userId: typeof Account.prototype.userId,
    @param.query.object('filter') filter?: Filter<PushSubscription>,
  ): Promise<PushSubscription[]> {
    return this.pushSubscriptionRepository.find({
      ...filter,
      where: {
        userId,
      },
    });
  }

  @del('/accounts/{userId}/push-subscriptions/{endpoint}')
  @response(204, {
    description: 'PushSubscription DELETE success',
  })
  async deleteUser(
    @param.path.number('userId') userId: typeof Account.prototype.userId,
    @param.path.string('endpoint')
    endpoint: typeof PushSubscription.prototype.endpoint,
  ): Promise<void> {
    const pushSubscription = await this.pushSubscriptionRepository.findById(
      endpoint,
    );
    if (pushSubscription.userId !== userId) {
      throw new HttpErrors.Forbidden(
        'Cannot delete push subscription of other user!',
      );
    }
    await this.pushSubscriptionRepository.deleteById(endpoint);
  }
}
