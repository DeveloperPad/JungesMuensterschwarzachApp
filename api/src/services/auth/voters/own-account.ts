import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
} from '@loopback/authorization';
import _ from 'lodash';
import {AccountProfile} from '../../../models';
import {securityId} from '@loopback/security/dist/types';

export async function ownAccount(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
) {
  let currentAccount: AccountProfile;

  if (authorizationCtx.principals.length == 0) {
    return AuthorizationDecision.DENY;
  }

  const account = _.pick(authorizationCtx.principals[0], [
    securityId,
    'userId',
  ]);
  currentAccount = {
    [securityId]: account[securityId],
    userId: account.userId,
  };

  // use resource and check for 'admin' scope with enforcer

  const userId = authorizationCtx.invocationContext.args[0];
  if (userId !== currentAccount.userId) {
    return AuthorizationDecision.DENY;
  }
  return AuthorizationDecision.ALLOW;
}
