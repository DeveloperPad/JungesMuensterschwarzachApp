import {BootMixin} from '@loopback/boot';
import {addExtension, ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {CustomSequence} from './sequence';
import {
  AuthenticationBindings,
  AuthenticationComponent,
} from '@loopback/authentication';
import {SessionHashAuthenticationProvider} from './services/auth/session-hash-authentication-provider';
import {
  AuthorizationBindings,
  AuthorizationComponent,
  AuthorizationDecision,
  AuthorizationTags,
} from '@loopback/authorization';
import { createEnforcer, SessionHashAuthorizationProvider } from './services';

export {ApplicationConfig};

export class Application extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

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
      precedence: AuthorizationDecision.ALLOW,
      defaultDecision: AuthorizationDecision.DENY,
    });

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

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
