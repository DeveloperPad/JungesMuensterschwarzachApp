import INewsItem from '../news/INewsItem';
import { IResponse } from '../Request';
import NewsRequest from './NewsRequest';

export default class NewsListRequest extends NewsRequest {

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(params: {},
        successCallback: (response: INewsListResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            params,
            successCallback,
            errorCallback
        );
    }

}

export interface INewsListResponse extends IResponse {
    news: INewsItem[]
}