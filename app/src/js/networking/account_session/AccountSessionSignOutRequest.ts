import AccountSessionRequest, { AccountSessionRequestActions, IAccountSessionResponse } from './AccountSessionRequest';

export class AccountSessionSignOutRequest extends AccountSessionRequest {

    constructor(
        successCallback: (response: IAccountSessionResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: AccountSessionRequestActions.SIGN_OUT
            },
            successCallback,
            errorCallback
        );
    }

}