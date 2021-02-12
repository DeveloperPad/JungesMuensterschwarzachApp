import { WebserviceUrls } from '../../constants/specific-urls';
import { IUserKeys } from '../account_data/IUser';
import Request, { IResponse } from '../Request';

interface IAccountPushSubscriptionRequestParams {
    action: AccountPushSubscriptionRequestActions;
    endpoint: string;
    keyAuth?: string;
    keyPub?: string;
    [IUserKeys.userId]?: number | null;
}

export enum AccountPushSubscriptionRequestActions {
    SUBSCRIBE = "subscribe",
    UNSUBSCRIBE = "unsubscribe"
}

export default class AccountPushSubscriptionRequest extends Request {

    constructor(
        params: IAccountPushSubscriptionRequestParams,
        successCallback: (result: IResponse) => void,
        errorCallback: (error: any) => void
    ) {
        super(
            WebserviceUrls.ACCOUNT_PUSH_SUBSCRIPTIONS,
            params,
            successCallback,
            errorCallback
        );
    }

}