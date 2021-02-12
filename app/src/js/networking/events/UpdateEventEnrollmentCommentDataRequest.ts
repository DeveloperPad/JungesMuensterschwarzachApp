import { IResponse } from '../Request';
import EventDataRequest, { EventDataRequestActions } from './EventDataRequest';
import { IEventEnrollmentKeys } from './IEventEnrollment';
import { IEventItemKeys } from './IEventItem';

export class UpdateEventEnrollmentCommentDataRequest extends EventDataRequest {

    constructor(
        eventId: number,
        value: string,
        successCallback: (response: IResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: EventDataRequestActions.UPDATE_EVENT_ENROLLMENT_COMMENT,
                [IEventItemKeys.eventId]: eventId,
                [IEventEnrollmentKeys.eventEnrollmentComment]: value
            },
            successCallback,
            errorCallback
        );
    }

}