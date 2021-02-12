import { IUserKeys } from '../account_data/IUser';
import AccountSessionRequest, { AccountSessionRequestActions, IAccountSessionResponse } from './AccountSessionRequest';

export class AccountSessionSignInRequest extends AccountSessionRequest {

    constructor(eMailAddress: string|null,
        password: string|null,
        successCallback: (response: IAccountSessionResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: AccountSessionRequestActions.SIGN_IN,
                [IUserKeys.eMailAddress]: eMailAddress,
                [IUserKeys.password]: password
            },
            successCallback,
            errorCallback
        );
    }

}