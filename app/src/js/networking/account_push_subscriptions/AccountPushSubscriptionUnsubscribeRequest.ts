import { IResponse } from '../Request';
import AccountPushSubscriptionRequest, { AccountPushSubscriptionRequestActions } from './AccountPushSubscriptionRequest';

export default class AccountPushSubscriptionUnsubscribeRequest extends AccountPushSubscriptionRequest {

    constructor(
        endpoint: string,
        successCallback: (result: IResponse) => void,
        errorCallback: (error: any) => void
    ) {
        super(
            {
                action: AccountPushSubscriptionRequestActions.UNSUBSCRIBE,
                endpoint
            },
            successCallback,
            errorCallback
        );
    }

}