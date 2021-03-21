import { WebserviceUrls } from '../../constants/specific-urls';
import Request from '../Request';
import { IUserKeys } from '../account_data/IUser';

type INewsletterRequestParams = {
    action: NewsletterRequestActions,
    [IUserKeys.eMailAddress]?: string,
    code?: string
}

export enum NewsletterRequestActions {
    SUBSCRIBE = "subscribe",
    REDEEM = "redeem"
}

export default class NewsletterRequest extends Request {

    constructor(params: INewsletterRequestParams,
        successCallback: (result: any) => void,
        errorCallback: (error: any) => void) {
        super(
            WebserviceUrls.NEWSLETTER,
            params,
            successCallback,
            errorCallback
        );
    }

}