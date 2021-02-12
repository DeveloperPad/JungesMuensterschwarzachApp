import { WebserviceUrls } from '../../constants/specific-urls';
import Request from '../Request';
import IUser from './IUser';

type IAccountDataRequestParams = IUser & {
    action: AccountDataRequestActions,
    code?: string
}

export enum AccountDataRequestActions {
    DELETE = "delete",
    FETCH = "fetch",
    REDEEM_TOKEN = "redeemToken",
    REQUEST_ACCOUNT_TRANSFER_MAIL = "requestAccountTransferMail",
    REQUEST_PASSWORD_RESET = "requestPasswordReset",
    RESEND_ACTIVATION_MAIL = "resendActivationMail",
    RESET_PASSWORD = "resetPassword",
    SIGN_UP = "signUp",
    UPDATE = "update"
}

export default class AccountDataRequest extends Request {

    constructor(params: IAccountDataRequestParams,
        successCallback: (result: any) => void,
        errorCallback: (error: any) => void) {
        super(
            WebserviceUrls.ACCOUNT_DATA,
            params,
            successCallback,
            errorCallback
        );
    }

}