import {
  AuthenticationBindings,
  AuthenticationComponent,
} from '@loopback/authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
  AuthorizationDecision,
  AuthorizationTags,
} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {addExtension, ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {dbConfigProduction, dbConfigTest} from './datasources';
import {CustomSequence} from './sequence';
import {createEnforcer, SessionHashAuthorizationProvider} from './services';
import {SessionHashAuthenticationProvider} from './services/auth/session-hash-authentication-provider';

export {ApplicationConfig};

export class Application extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // set up env
    this.bind('datasources.config.db').to(
      options.useRealDatabase ?? true ? dbConfigProduction : dbConfigTest,
    );

    // custom sequence
    this.sequence(CustomSequence);

    // authentication
    this.component(AuthenticationComponent);
    addExtension(
      this,
      AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME,
      SessionHashAuthenticationProvider,
      {
        namespace:
          AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME,
      },
    );
    // authorization
    this.component(AuthorizationComponent);
    this.bind('casbin.enforcer').toDynamicValue(createEnforcer);
    this.bind('authorizationProviders.sessionHashAuthorizationProvider')
      .toProvider(SessionHashAuthorizationProvider)
      .tag(AuthorizationTags.AUTHORIZER);
    this.configure(AuthorizationBindings.COMPONENT).to({
      precedence: AuthorizationDecision.DENY,
      defaultDecision: AuthorizationDecision.DENY,
    });

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
