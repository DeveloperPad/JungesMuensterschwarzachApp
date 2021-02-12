import { WebserviceUrls } from '../../constants/specific-urls';
import Request from '../Request';
import { IEventEnrollmentKeys } from './IEventEnrollment';
import { IEventItemKeys } from './IEventItem';

interface IEventDataRequestParams {
    action: EventDataRequestActions,
    [IEventItemKeys.eventId]?: number,
    [IEventEnrollmentKeys.eventEnrollmentComment]?: string
}

export enum EventDataRequestActions {
    DISENROLL = "disenroll",
    ENROLL = "enroll",
    FETCH_EVENT = "fetchEvent",
    FETCH_EVENT_ENROLLMENT = "fetchEventEnrollment",
    FETCH_EVENT_LIST = "fetchEventList",
    UPDATE_EVENT_ENROLLMENT_COMMENT = "updateEventEnrollmentComment"
}

export default class EventDataRequest extends Request {

    constructor(params: IEventDataRequestParams,
        successCallback: (result: any) => void,
        errorCallback: (error: any) => void) {
        super(
            WebserviceUrls.EVENTS,
            params,
            successCallback,
            errorCallback
        );
    }

}