import { IResponse } from '../Request';
import AccountDataRequest, { AccountDataRequestActions } from './AccountDataRequest';
import { IUserKeys } from './IUser';

export class UpdateAccountDataRequest extends AccountDataRequest {

    constructor(
        key: IUserKeys,
        value: string,
        successCallback: (response: IResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: AccountDataRequestActions.UPDATE,
                [key]: value
            },
            successCallback,
            errorCallback
        );
    }

}