import { IResponse } from '../Request';
import AccountDataRequest, { AccountDataRequestActions } from './AccountDataRequest';
import { IUserKeys } from './IUser';

export class RequestAccountTransferMailRequest extends AccountDataRequest {

    constructor(eMailAddress: string,
        successCallback: (response: IResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: AccountDataRequestActions.REQUEST_ACCOUNT_TRANSFER_MAIL,
                [IUserKeys.eMailAddress]: eMailAddress
            },
            successCallback,
            errorCallback
        );
    }

}