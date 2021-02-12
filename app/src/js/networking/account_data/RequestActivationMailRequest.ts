import { IResponse } from '../Request';
import AccountDataRequest, { AccountDataRequestActions } from './AccountDataRequest';
import { IUserKeys } from './IUser';

export class RequestActivationMailRequest extends AccountDataRequest {

    constructor(eMailAddress: string,
        successCallback: (response: IResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: AccountDataRequestActions.RESEND_ACTIVATION_MAIL,
                [IUserKeys.eMailAddress]: eMailAddress
            },
            successCallback,
            errorCallback
        );
    }

}