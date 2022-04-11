import { IResponse } from '../Request';
import EventDataRequest, { EventDataRequestActions } from './EventDataRequest';
import { IEventEnrollmentKeys } from './IEventEnrollment';
import { IEventItemKeys } from './IEventItem';

export class UpdateEventEnrollmentPublicMediaUsageConsentDataRequest extends EventDataRequest {

    constructor(
        eventId: number,
        eventEnrollmentPublicMediaUsageConsent: number,
        successCallback: (response: IResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: EventDataRequestActions.UPDATE_EVENT_ENROLLMENT_PUBLIC_MEDIA_USAGE_CONSENT,
                [IEventItemKeys.eventId]: eventId,
                [IEventEnrollmentKeys.eventEnrollmentPublicMediaUsageConsent]: eventEnrollmentPublicMediaUsageConsent
            },
            successCallback,
            errorCallback
        );
    }

}