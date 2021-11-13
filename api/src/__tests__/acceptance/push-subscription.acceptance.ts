import {Client, expect} from '@loopback/testlab';
import {beforeEach} from 'mocha';
import {Application} from '../..';
import {givenEmptyDatabase, setupApplication} from '../helpers/bootstrap';
import {
  getSessionHash,
  givenTestAccounts,
  TestAccounts,
} from '../helpers/data/account';
import {
  givenPushSubscription,
  rawPushSubscription,
} from '../helpers/data/push-subscription';

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

  // ADMIN

  // findAll

  it('[admin] can find all push subscriptions', async () => {
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

  it('[user] cannot find all push subscriptions', async () => {
    return client
      .get('/push-subscriptions')
      .set('Authorization', 'Bearer ' + getSessionHash(accounts.leader))
      .expect(403);
  });

  // GUESTS

  // createGuest

  it('[guest] can create new push subscription', async () => {
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
    return client
      .post('/push-subscriptions')
      .set('accept', 'json')
      .send(existingPushSubscription)
      .expect(409);
  });

  // deleteGuest

  it('[guest] can delete guest push subscription', async () => {
    const pushSubscription = await givenPushSubscription(app);
    return await client
      .delete('/push-subscriptions/' + pushSubscription.endpoint)
      .expect(204);
  });

  it('[guest] cannot delete user push subscription ', async () => {
    const pushSubscription = await givenPushSubscription(app, accounts.user);
    return await client
      .delete('/push-subscriptions/' + pushSubscription.endpoint)
      .expect(403);
  });

  it('[guest] cannot delete not existing push subscription ', async () => {
    return await client.delete('/push-subscriptions/non-existing').expect(404);
  });

  // USERS

  // createUser

  it('[guest] cannot create user push subscription', async () => {
    const pushSubscription = rawPushSubscription(accounts.user);
    return client
      .post('/accounts/' + pushSubscription.userId + '/push-subscriptions')
      .set('accept', 'json')
      .send(pushSubscription)
      .expect(401);
  });

  it('[user] can create new push subscription', async () => {
    const pushSubscription = rawPushSubscription(accounts.user);
    const res = await client
      .post('/accounts/' + pushSubscription.userId + '/push-subscriptions')
      .set('Authorization', 'Bearer ' + getSessionHash(accounts.user))
      .set('accept', 'json')
      .send(pushSubscription)
      .expect(200);
    return expect(res.body).to.containEql(pushSubscription);
  });

  it('[user] cannot create existing push subscription', async () => {
    await givenPushSubscription(app, accounts.user);
    const existingPushSubscription = rawPushSubscription(accounts.user);
    return client
      .post(
        '/accounts/' + existingPushSubscription.userId + '/push-subscriptions',
      )
      .set('Authorization', 'Bearer ' + getSessionHash(accounts.user))
      .set('accept', 'json')
      .send(existingPushSubscription)
      .expect(409);
  });

  it('[user] cannot create new push subscription with foreign userId', async () => {
    const pushSubscription = rawPushSubscription(accounts.user);
    pushSubscription.userId = accounts.editor.userId;
    return client
      .post('/accounts/' + accounts.user.userId + '/push-subscriptions')
      .set('Authorization', 'Bearer ' + getSessionHash(accounts.user))
      .set('accept', 'json')
      .send(pushSubscription)
      .expect(403);
  });

  it('[user] cannot create new push subscription with foreign endpoint', async () => {
    const pushSubscription = rawPushSubscription(accounts.editor);
    return client
      .post('/accounts/' + pushSubscription.userId + '/push-subscriptions')
      .set('Authorization', 'Bearer ' + getSessionHash(accounts.user))
      .set('accept', 'json')
      .send(pushSubscription)
      .expect(403);
  });

  it('[admin] can create new push subscription with foreign endpoint', async () => {
    const pushSubscription = rawPushSubscription(accounts.editor);
    const res = await client
      .post('/accounts/' + pushSubscription.userId + '/push-subscriptions')
      .set('Authorization', 'Bearer ' + getSessionHash(accounts.developer))
      .set('accept', 'json')
      .send(pushSubscription)
      .expect(200);
    return expect(res.body).to.containEql(pushSubscription);
  });

  // findUser

  it("[guest] cannot find other user's push subscriptions", async () => {
    const pushSubscription = await givenPushSubscription(app, accounts.editor);
    return client
      .get('/accounts/' + pushSubscription.userId + '/push-subscriptions')
      .expect(401);
  });

  it('[user] can find its own push subscriptions', async () => {
    const pushSubscription = await givenPushSubscription(app, accounts.user);
    const res = await client
      .get('/accounts/' + pushSubscription.userId + '/push-subscriptions')
      .set('Authorization', 'Bearer ' + getSessionHash(accounts.user))
      .expect(200);
    const pushSubscriptions = res.body;
    expect(pushSubscriptions).to.be.a.Array();
    return expect(pushSubscriptions).to.containEql(
      Object.assign({}, pushSubscription),
    );
  });

  it("[user] cannot find other user's push subscriptions", async () => {
    const pushSubscription = await givenPushSubscription(app, accounts.editor);
    return client
      .get('/accounts/' + pushSubscription.userId + '/push-subscriptions')
      .set('Authorization', 'Bearer ' + getSessionHash(accounts.user))
      .expect(403);
  });

  it("[admin] can find other user's push subscriptions", async () => {
    const pushSubscription = await givenPushSubscription(app, accounts.user);
    const res = await client
      .get('/accounts/' + pushSubscription.userId + '/push-subscriptions')
      .set('Authorization', 'Bearer ' + getSessionHash(accounts.developer))
      .expect(200);
    const pushSubscriptions = res.body;
    expect(pushSubscriptions).to.be.a.Array();
    return expect(pushSubscriptions).to.containEql(
      Object.assign({}, pushSubscription),
    );
  });

  // deleteUser
  it('[guest] cannot delete user push subscription', async () => {
    const pushSubscription = await givenPushSubscription(app, accounts.user);
    return client
      .delete(
        '/accounts/' +
          pushSubscription.userId +
          '/push-subscriptions/' +
          pushSubscription.endpoint,
      )
      .expect(401);
  });

  it('[user] can delete its own push subscription', async () => {
    const pushSubscription = await givenPushSubscription(app, accounts.user);
    return client
      .delete(
        '/accounts/' +
          pushSubscription.userId +
          '/push-subscriptions/' +
          pushSubscription.endpoint,
      )
      .set('Authorization', 'Bearer ' + getSessionHash(accounts.user))
      .expect(204);
  });

  it('[user] cannot delete push subscription with foreign userId', async () => {
    const pushSubscription = await givenPushSubscription(app, accounts.editor);
    return client
      .delete(
        '/accounts/' +
          accounts.user.userId +
          '/push-subscriptions/' +
          pushSubscription.endpoint,
      )
      .set('Authorization', 'Bearer ' + getSessionHash(accounts.user))
      .expect(403);
  });

  it('[user] cannot delete push subscription with foreign endpoint', async () => {
    const pushSubscription = await givenPushSubscription(app, accounts.editor);
    return client
      .delete(
        '/accounts/' +
          pushSubscription.userId +
          '/push-subscriptions/' +
          pushSubscription.endpoint,
      )
      .set('Authorization', 'Bearer ' + getSessionHash(accounts.user))
      .expect(403);
  });

  it('[admin] can delete push subscription of other user', async () => {
    const pushSubscription = await givenPushSubscription(app, accounts.user);
    return client
      .delete(
        '/accounts/' +
          pushSubscription.userId +
          '/push-subscriptions/' +
          pushSubscription.endpoint,
      )
      .set('Authorization', 'Bearer ' + getSessionHash(accounts.developer))
      .expect(204);
  });
});
