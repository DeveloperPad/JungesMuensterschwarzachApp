import { WebserviceUrls } from '../../constants/specific-urls';
import IUser, { IUserKeys } from '../account_data/IUser';
import Request, { IResponse } from '../Request';

type IAccountSessionRequestParams = {
    action: AccountSessionRequestActions,
    [IUserKeys.eMailAddress]?: string|null;
    [IUserKeys.password]?: string|null;
}

export enum AccountSessionRequestActions {
    SIGN_IN = "signIn",
    SIGN_OUT = "signOut"
}

export default class AccountSessionRequest extends Request {

    constructor(params: IAccountSessionRequestParams,
        successCallback: (result: IAccountSessionResponse) => void,
        errorCallback: (error: any) => void) {
        super(
            WebserviceUrls.ACCOUNT_SESSIONS,
            params,
            successCallback,
            errorCallback
        );
    }

}

export interface IAccountSessionResponse extends IResponse {
    user: IUser;
}