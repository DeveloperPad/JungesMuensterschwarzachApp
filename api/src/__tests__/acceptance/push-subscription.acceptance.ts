import {Client, expect} from '@loopback/testlab';
import {Application} from '../..';
import {PushSubscription} from '../../models';
import {givenEmptyDatabase, setupApplication} from '../helpers/bootstrap';
import {
  getSessionHash,
  givenTestAccounts,
  TestAccounts,
} from '../helpers/data/account';
import {givenPushSubscription} from '../helpers/data/push-subscription';

describe('PushSubscriptionController', () => {
  let app: Application;
  let client: Client;
  let accounts: TestAccounts;
  let pushSubscription: PushSubscription;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    return Promise.resolve();
  });
  before('setupDatabase', async () => {
    await givenEmptyDatabase(app);
    accounts = await givenTestAccounts(app);
    pushSubscription = await givenPushSubscription(app, accounts.user);
    return Promise.resolve();
  });

  after(async () => {
    return app.stop();
  });

  it('finds all pushsubscriptions as admin', async () => {
    const res = await client
      .get('/push-subscriptions')
      .set('Authorization', 'Bearer ' + getSessionHash(accounts.developer))
      .expect(200);
    const pushSubscriptions = res.body;
    expect(pushSubscriptions).to.be.a.Array();
    expect(pushSubscriptions).to.containEql(
      Object.assign({}, pushSubscription),
    );
    return Promise.resolve();
  });

  it("doesn't find pushsubscriptions as non-admin", async () => {
    return client
      .get('/push-subscriptions')
      .set('Authorization', 'Bearer ' + getSessionHash(accounts.leader))
      .expect(403);
  });
});
