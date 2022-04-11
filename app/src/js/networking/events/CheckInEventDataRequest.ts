import { IResponse } from '../Request';
import EventDataRequest, { EventDataRequestActions } from './EventDataRequest';
import { IEventEnrollmentKeys } from './IEventEnrollment';
import { IEventItemKeys } from './IEventItem';

export class CheckInEventDataRequest extends EventDataRequest {

    constructor(
        eventId: number,
        eventEnrollmentPublicMediaUsageConsent: number,
        successCallback: (response: IResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: EventDataRequestActions.CHECK_IN,
                [IEventItemKeys.eventId]: eventId,
                [IEventEnrollmentKeys.eventEnrollmentPublicMediaUsageConsent]: eventEnrollmentPublicMediaUsageConsent
            },
            successCallback,
            errorCallback
        );
    }

}