import { IResponse } from '../Request';
import EventDataRequest, { EventDataRequestActions } from './EventDataRequest';
import { IEventEnrollmentKeys } from './IEventEnrollment';
import { IEventItemKeys } from './IEventItem';

export class EnrollEventDataRequest extends EventDataRequest {

    constructor(
        eventId: number,
        eventEnrollmentComment: string,
        successCallback: (response: IResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: EventDataRequestActions.ENROLL,
                [IEventItemKeys.eventId]: eventId,
                [IEventEnrollmentKeys.eventEnrollmentComment]: eventEnrollmentComment
            },
            successCallback,
            errorCallback
        );
    }

}