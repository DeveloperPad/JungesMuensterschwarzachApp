import { WebserviceUrls } from '../../constants/specific-urls';
import Request from '../Request';

interface INewsRequestParams {
    newsId?: number
}

export default class NewsRequest extends Request {

    constructor(params: INewsRequestParams,
        successCallback: (response: any) => void,
        errorCallback: (error: any) => void) {
        super(
            WebserviceUrls.NEWS,
            params,
            successCallback,
            errorCallback
        );
    }

}