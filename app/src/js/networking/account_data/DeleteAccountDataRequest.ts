import { IResponse } from '../Request';
import AccountDataRequest, { AccountDataRequestActions } from './AccountDataRequest';

export class DeleteAccountDataRequest extends AccountDataRequest {

    constructor(
        successCallback: (response: IResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: AccountDataRequestActions.DELETE
            },
            successCallback,
            errorCallback
        );
    }

}