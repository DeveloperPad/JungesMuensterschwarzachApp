import { IResponse } from '../Request';
import EventDataRequest, { EventDataRequestActions } from './EventDataRequest';
import IEventEnrollment from './IEventEnrollment';
import { IEventItemKeys } from './IEventItem';

export class FetchEventEnrollmentDataRequest extends EventDataRequest {

    constructor(
        eventId: number,
        successCallback: (response: IFetchEventEnrollmentDataResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: EventDataRequestActions.FETCH_EVENT_ENROLLMENT,
                [IEventItemKeys.eventId]: eventId
            },
            successCallback,
            errorCallback
        );
    }

}

export interface IFetchEventEnrollmentDataResponse extends IResponse {
    eventEnrollment: IEventEnrollment
}