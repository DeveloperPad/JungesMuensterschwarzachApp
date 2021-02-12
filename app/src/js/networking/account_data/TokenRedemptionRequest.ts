import { IResponse } from '../Request';
import AccountDataRequest, { AccountDataRequestActions } from './AccountDataRequest';

export class TokenRedemptionRequest extends AccountDataRequest {

    constructor(code: string,
        successCallback: (response: IResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: AccountDataRequestActions.REDEEM_TOKEN,
                code
            },
            successCallback,
            errorCallback
        );
    }

}