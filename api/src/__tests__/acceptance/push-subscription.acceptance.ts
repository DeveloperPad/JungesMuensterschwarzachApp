import {Client, expect} from '@loopback/testlab';
import { beforeEach } from 'mocha';
import {Application} from '../..';
import {PushSubscription} from '../../models';
import {givenEmptyDatabase, setupApplication} from '../helpers/bootstrap';
import {
  getSessionHash,
  givenTestAccounts,
  TestAccounts,
} from '../helpers/data/account';
import {givenPushSubscription, rawPushSubscription} from '../helpers/data/push-subscription';

describe('PushSubscriptionController', () => {
  let app: Application;
  let client: Client;
  let accounts: TestAccounts;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    return Promise.resolve();
  });
  beforeEach('setupDatabase', async () => {
    await givenEmptyDatabase(app);
    accounts = await givenTestAccounts(app);
    return Promise.resolve();
  });

  after(async () => {
    return app.stop();
  });

  // admin

  it('[admin] finds all pushsubscriptions', async () => {
    const pushSubscription = await givenPushSubscription(app, accounts.leader);
    const res = await client
      .get('/push-subscriptions')
      .set('Authorization', 'Bearer ' + getSessionHash(accounts.developer))
      .expect(200);
    const pushSubscriptions = res.body;
    expect(pushSubscriptions).to.be.a.Array();
    return expect(pushSubscriptions).to.containEql(
      Object.assign({}, pushSubscription),
    );
  });

  it("[admin] doesn't find all pushsubscriptions if not admin", async () => {
    return client
      .get('/push-subscriptions')
      .set('Authorization', 'Bearer ' + getSessionHash(accounts.leader))
      .expect(403);
  });

  // guests

  it('[guest] creates new push subscription', async () => {
    const pushSubscription = rawPushSubscription(accounts.developer);
    const res = await client
      .post('/push-subscriptions')
      .set('accept', 'json')
      .send(pushSubscription)
      .expect(200);
    
    delete pushSubscription.userId;
    expect(res.body).to.containEql(pushSubscription);
    return Promise.resolve();
  });

  it('[guest] cannot create existing push subscription', async () => {
    await givenPushSubscription(app, accounts.user);
    const existingPushSubscription = rawPushSubscription(accounts.user);
    const res = await client
      .post('/push-subscriptions')
      .set('accept', 'json')
      .send(existingPushSubscription)
      .expect(409);
    return Promise.resolve();
  });

  it('[guest] deletes guest push subscription', async () => {
    const pushSubscription = await givenPushSubscription(app);
    return await client
      .delete('/push-subscriptions/'+pushSubscription.endpoint)
      .expect(204);
  });

  it('[guest] cannot delete user push subscription ', async () => {
    const pushSubscription = await givenPushSubscription(app, accounts.user);
    return await client
      .delete('/push-subscriptions/'+pushSubscription.endpoint)
      .expect(403);
  });

  it('[guest] cannot delete not existing push subscription ', async () => {
    return await client
      .delete('/push-subscriptions/non-existing')
      .expect(404);
  });

});
