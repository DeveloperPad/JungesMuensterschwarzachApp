import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  AuthorizationRequest,
  Authorizer,
} from '@loopback/authorization';
import {inject, Provider} from '@loopback/core';
import {securityId} from '@loopback/security/dist/types';
import * as casbin from 'casbin';
import _ from 'lodash';
import * as path from 'path';
import {AccountProfile} from '../../models';

export class SessionHashAuthorizationProvider implements Provider<Authorizer> {
  constructor(@inject('casbin.enforcer') private enforcer: casbin.Enforcer) {}

  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ) {
    const request: AuthorizationRequest = {
      subject: authorizationCtx.principals[0][securityId],
      object: metadata.resource ?? authorizationCtx.resource,
      action: metadata.scopes?.[0] ?? 'execute',
    };

    const allow = await this.enforcer.enforce(
      request.subject,
      request.object,
      request.action,
    );
    switch (allow) {
      case true:
        return AuthorizationDecision.ALLOW;
      case false:
        return AuthorizationDecision.DENY;
      default:
        return AuthorizationDecision.ABSTAIN;
    }
  }
}

export async function createEnforcer() {
  return casbin.newEnforcer(
    path.resolve(__dirname, '../../../static/auth/rbac_model.conf'),
    path.resolve(__dirname, '../../../static/auth/rbac_policy.csv'),
  );
}

interface SessionHashAuthorizationMetadata extends AuthorizationMetadata {
  currentAccount: AccountProfile;
  decision: AuthorizationDecision;
}

export async function accessSelf(
  authorizationCtx: AuthorizationContext,
  metadata: SessionHashAuthorizationMetadata,
) {
  let currentAccount: AccountProfile;

  if (authorizationCtx.principals.length > 0) {
    const account = _.pick(authorizationCtx.principals[0], [
      securityId,
      'userId',
    ]);
    currentAccount = {
      [securityId]: account[securityId],
      userId: account.userId,
    };
  } else {
    return AuthorizationDecision.DENY;
  }

  const accessLevel = authorizationCtx.invocationContext.args[0];
  return accessLevel === currentAccount[securityId]
    ? AuthorizationDecision.ALLOW
    : AuthorizationDecision.DENY;
}
