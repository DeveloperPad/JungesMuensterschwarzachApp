import {Client, expect} from '@loopback/testlab';
import {Application} from '../..';
import {String} from '../../models';
import {setupApplication} from '../helpers/bootstrap';

describe('StringController (prod)', () => {
  let app: Application;
  let client: Client;

  const string: String = new String({
    identifier: 'account_accessLevel',
    de: 'Berechtigungsstufe',
    en: 'Access level'
  });

  before('setupApplication', async () => {
    ({app, client} = await setupApplication(true));
    return Promise.resolve();
  });

  after(async () => {
    return app.stop();
  });

  it('provides German translations', async () => {
    const res = await client.get('/strings/de').expect(200);
    expect(res.body).to.be.a.Array();
    expect(res.body).to.containEql({
      identifier: string.identifier,
      de: string.de,
    });
    return Promise.resolve();
  });

  it('provides English translations', async () => {
    const res = await client.get('/strings/en').expect(200);
    expect(res.body).to.be.a.Array();
    expect(res.body).to.containEql({
      identifier: string.identifier,
      en: string.en,
    });
    return Promise.resolve();
  });
});
