import { IResponse } from '../Request';
import NewsletterRequest, { NewsletterRequestActions } from './NewsletterRequest';

export class NewsletterRedemptionRequest extends NewsletterRequest {

    constructor(code: string,
        successCallback: (response: IResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: NewsletterRequestActions.REDEEM,
                code
            },
            successCallback,
            errorCallback
        );
    }

}