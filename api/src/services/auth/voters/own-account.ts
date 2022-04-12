import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  AuthorizationRequest,
} from '@loopback/authorization';
import {securityId} from '@loopback/security/dist/types';
import _ from 'lodash';
import {createEnforcer} from '../session-hash-authorization-provider.service';

export async function ownAccountVoter(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
) {
  if (authorizationCtx.principals.length === 0) {
    return AuthorizationDecision.DENY;
  }

  const account = _.pick(authorizationCtx.principals[0], [
    securityId,
    'userId',
  ]);
  const currentAccount = {
    [securityId]: account[securityId],
    userId: account.userId,
  };

  const request: AuthorizationRequest = {
    subject: currentAccount[securityId],
    object: metadata.resource ?? authorizationCtx.resource,
    action: 'admin',
  };

  const enforcer = await createEnforcer();
  const adminByPass = await enforcer.enforce(
    request.subject,
    request.object,
    request.action,
  );
  if (adminByPass === true) {
    return AuthorizationDecision.ALLOW;
  }

  const ctxUserId = authorizationCtx.invocationContext.args[0];
  if (ctxUserId !== currentAccount.userId) {
    return AuthorizationDecision.DENY;
  }
  return AuthorizationDecision.ALLOW;
}
