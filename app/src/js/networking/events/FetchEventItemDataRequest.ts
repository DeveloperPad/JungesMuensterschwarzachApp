import { IResponse } from '../Request';
import EventDataRequest, { EventDataRequestActions } from './EventDataRequest';
import IEventItem, { IEventItemKeys } from './IEventItem';

export class FetchEventItemDataRequest extends EventDataRequest {

    constructor(
        eventId: number,
        successCallback: (response: IFetchEventItemDataResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: EventDataRequestActions.FETCH_EVENT,
                [IEventItemKeys.eventId]: eventId
            },
            successCallback,
            errorCallback
        );
    }

}

export interface IFetchEventItemDataResponse extends IResponse {
    eventList: IEventItem[]
}