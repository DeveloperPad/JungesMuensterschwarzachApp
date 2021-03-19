import { IResponse } from '../Request';
import AccountDataRequest, { AccountDataRequestActions } from './AccountDataRequest';
import { IUserKeys } from './IUser';

export class SignUpRequest extends AccountDataRequest {

    constructor(displayName: string,
        eMailAddress: string,
        password: string,
        allowNewsletter: number,
        successCallback: (response: IResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: AccountDataRequestActions.SIGN_UP,
                [IUserKeys.displayName]: displayName,
                [IUserKeys.eMailAddress]: eMailAddress,
                password,
                [IUserKeys.allowNewsletter]: allowNewsletter
            },
            successCallback,
            errorCallback
        );
    }

}