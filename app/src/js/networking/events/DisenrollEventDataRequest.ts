import { IResponse } from '../Request';
import EventDataRequest, { EventDataRequestActions } from './EventDataRequest';
import { IEventItemKeys } from './IEventItem';

export class DisenrollEventDataRequest extends EventDataRequest {

    constructor(
        eventId: number,
        successCallback: (response: IResponse) => void,
        errorCallback: (error: string) => void) {
        super(
            {
                action: EventDataRequestActions.DISENROLL,
                [IEventItemKeys.eventId]: eventId
            },
            successCallback,
            errorCallback
        );
    }

}