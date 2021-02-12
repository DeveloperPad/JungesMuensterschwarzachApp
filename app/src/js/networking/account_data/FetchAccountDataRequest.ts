import { IResponse } from '../Request';
import AccountDataRequest, { AccountDataRequestActions } from './AccountDataRequest';
import IUser from './IUser';

export class FetchAccountDataRequest extends AccountDataRequest {

    constructor(
        successCallback: (response: IFetchAccountDataResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: AccountDataRequestActions.FETCH
            },
            successCallback,
            errorCallback
        );
    }

}

export interface IFetchAccountDataResponse extends IResponse {
    user: IUser;
}