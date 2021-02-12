import { IResponse } from '../Request';
import AccountDataRequest, { AccountDataRequestActions } from './AccountDataRequest';
import { IUserKeys } from './IUser';

export class RequestPasswordResetRequest extends AccountDataRequest {

    constructor(eMailAddress: string,
        successCallback: (response: IResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: AccountDataRequestActions.REQUEST_PASSWORD_RESET,
                [IUserKeys.eMailAddress]: eMailAddress
            },
            successCallback,
            errorCallback
        );
    }

}