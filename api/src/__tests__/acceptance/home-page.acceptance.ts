import {Client} from '@loopback/testlab';
import {Application} from '../..';
import {setupApplication} from '../helpers/bootstrap';

describe('HomePage', () => {
  let app: Application;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    return Promise.resolve();
  });

  after(async () => {
    return app.stop();
  });

  it('exposes a default home page', async () => {
    return client
      .get('/')
      .expect(200)
      .expect('Content-Type', /text\/html/);
  });

  it('exposes self-hosted explorer', async () => {
    return client
      .get('/explorer/')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .expect(/<title>LoopBack API Explorer/);
  });
});
