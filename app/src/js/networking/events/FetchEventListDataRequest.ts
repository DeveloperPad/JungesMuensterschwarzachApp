import { IResponse } from '../Request';
import EventDataRequest, { EventDataRequestActions } from './EventDataRequest';
import IEventItem from './IEventItem';

export class FetchEventListDataRequest extends EventDataRequest {

    constructor(
        successCallback: (response: IFetchEventListDataResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: EventDataRequestActions.FETCH_EVENT_LIST,
            },
            successCallback,
            errorCallback
        );
    }

}

export interface IFetchEventListDataResponse extends IResponse {
    eventList: IEventItem[]
}