import { IResponse } from '../Request';
import AccountPushSubscriptionRequest, { AccountPushSubscriptionRequestActions } from './AccountPushSubscriptionRequest';

export default class AccountPushSubscriptionSubscribeRequest extends AccountPushSubscriptionRequest {

    constructor(
        endpoint: string,
        keyAuth: string,
        keyPub: string,
        userId: number | null,
        successCallback: (result: IResponse) => void,
        errorCallback: (error: any) => void
    ) {
        super(
            {
                action: AccountPushSubscriptionRequestActions.SUBSCRIBE,
                endpoint,
                keyAuth,
                keyPub,
                userId
            },
            successCallback,
            errorCallback
        );
    }

}