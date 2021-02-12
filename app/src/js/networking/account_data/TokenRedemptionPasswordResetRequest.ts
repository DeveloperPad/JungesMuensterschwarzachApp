import { IResponse } from '../Request';
import AccountDataRequest, { AccountDataRequestActions } from './AccountDataRequest';

export class TokenRedemptionPasswordResetRequest extends AccountDataRequest {

    constructor(code: string,
        password: string,
        successCallback: (response: IResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: AccountDataRequestActions.RESET_PASSWORD,
                code,
                password
            },
            successCallback,
            errorCallback
        );
    }

}