import {Application} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {Repositories as Repositories} from './repositories';

export async function setupApplication(useRealDatabase: boolean = false): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new Application({
    rest: restConfig,
    useRealDatabase
  });

  app.bind(Repositories.BINDING).toClass(Repositories);
  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: Application;
  client: Client;
}

export async function givenEmptyDatabase(app: Application) {
  const repos: Repositories = await app.get(
    Repositories.BINDING,
  );

  await repos.pushSubscriptionRepository.deleteAll();
  await repos.sessionHashRepository.deleteAll();
  await repos.sessionOtpRepository.deleteAll();
  await repos.accountRepository.deleteAll();
}
