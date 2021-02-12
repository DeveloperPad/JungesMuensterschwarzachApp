import INewsItem from '../news/INewsItem';
import { IResponse } from '../Request';
import NewsRequest from './NewsRequest';

interface INewsItemRequestParams {
    newsId: number
}

export default class NewsItemRequest extends NewsRequest {

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(params: INewsItemRequestParams,
        successCallback: (response: INewsItemResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            params,
            successCallback,
            errorCallback
        );
    }

}

export interface INewsItemResponse extends IResponse {
    news: INewsItem
}