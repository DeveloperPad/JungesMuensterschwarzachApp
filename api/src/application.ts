import {BootMixin} from '@loopback/boot';
import {addExtension, ApplicationConfig, CoreTags} from '@loopback/core';
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
} from '@loopback/authorization';

export {ApplicationConfig};

export class Application extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // authentication
    this.component(AuthenticationComponent);
    this.sequence(CustomSequence);
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
    this.configure(AuthorizationBindings.COMPONENT).to({
      precedence: AuthorizationDecision.ALLOW,
      defaultDecision: AuthorizationDecision.DENY,
    });
    this.component(AuthorizationComponent);

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
