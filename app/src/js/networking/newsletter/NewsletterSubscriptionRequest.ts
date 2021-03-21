import { IResponse } from '../Request';
import { IUserKeys } from '../account_data/IUser';
import NewsletterRequest, { NewsletterRequestActions } from './NewsletterRequest';

export class NewsletterSubscriptionRequest extends NewsletterRequest {

    constructor(eMailAddress: string,
        successCallback: (response: IResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: NewsletterRequestActions.SUBSCRIBE,
                [IUserKeys.eMailAddress]: eMailAddress
            },
            successCallback,
            errorCallback
        );
    }

}