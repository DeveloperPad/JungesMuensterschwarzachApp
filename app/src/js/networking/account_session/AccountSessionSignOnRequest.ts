import AccountSessionRequest, { AccountSessionRequestActions, IAccountSessionResponse } from './AccountSessionRequest';

export class AccountSessionSignOnRequest extends AccountSessionRequest {

    constructor(
        successCallback: (response: IAccountSessionResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: AccountSessionRequestActions.SIGN_IN
            },
            successCallback,
            errorCallback
        );
    }

}