import Formats from '../../constants/formats';
import { getDate } from '../../constants/global-functions';
import IUser from '../account_data/IUser';
import IImage from '../images/IImage';

// this enum defines the event object's keys
export enum IEventItemKeys {
    accessIdentifier = "accessIdentifier",
    eventArrivalContent = "eventArrivalContent",
    eventArrivalId = "eventArrivalId",
    eventArrivalTitle = "eventArrivalTitle",
    eventDetails = "eventDetails",
    eventEnd = "eventEnd",
    eventEnrollmentComment = "eventEnrollmentComment",
    eventEnrollmentEnd = "eventEnrollmentEnd",
    eventEnrollmentStart = "eventEnrollmentStart",
    eventId = "eventId",
    eventLocationId = "eventLocationId",
    eventLocationLatitude = "eventLocationLatitude",
    eventLocationLongitude = "eventLocationLongitude",
    eventLocationTitle = "eventLocationTitle",
    eventModificationDate = "eventModificationDate",
    eventOfferContent = "eventOfferContent",
    eventOfferId = "eventOfferId",
    eventOfferTitle = "eventOfferTitle",
    eventPackingListContent = "eventPackingListContent",
    eventPackingListId = "eventPackingListId",
    eventPackingListTitle = "eventPackingListTitle",
    eventParticipants = "eventParticipants",
    eventPriceContent = "eventPriceContent",
    eventPriceId = "eventPriceId",
    eventPriceTitle = "eventPriceTitle",
    eventScheduleContent = "eventScheduleContent",
    eventScheduleId = "eventScheduleId",
    eventScheduleTitle = "eventScheduleTitle",
    eventStart = "eventStart",
    eventTargetGroupContent = "eventTargetGroupContent",
    eventTargetGroupId = "eventTargetGroupId",
    eventTargetGroupTitle = "eventTargetGroupTitle",
    eventTitle = "eventTitle",
    eventTopic = "eventTopic",
    imageIds = "imageIds",
    requiredAccessLevel = "requiredAccessLevel"
}

// this interface defines the user object's structure and value types
export default interface IEventItem {
    [IEventItemKeys.accessIdentifier]?: string;
    [IEventItemKeys.eventArrivalContent]?: string;
    [IEventItemKeys.eventArrivalId]?: number;
    [IEventItemKeys.eventArrivalTitle]?: string;
    [IEventItemKeys.eventDetails]?: string;
    [IEventItemKeys.eventEnd]?: Date;
    [IEventItemKeys.eventEnrollmentComment]?: string;
    [IEventItemKeys.eventEnrollmentEnd]?: Date;
    [IEventItemKeys.eventEnrollmentStart]?: Date;
    [IEventItemKeys.eventId]?: number;
    [IEventItemKeys.eventLocationId]?: number;
    [IEventItemKeys.eventLocationLatitude]?: number;
    [IEventItemKeys.eventLocationLongitude]?: number;
    [IEventItemKeys.eventLocationTitle]?: string;
    [IEventItemKeys.eventModificationDate]?: Date;
    [IEventItemKeys.eventOfferContent]?: string;
    [IEventItemKeys.eventOfferId]?: number;
    [IEventItemKeys.eventOfferTitle]?: string;
    [IEventItemKeys.eventPackingListContent]?: string;
    [IEventItemKeys.eventPackingListId]?: number;
    [IEventItemKeys.eventPackingListTitle]?: string;
    [IEventItemKeys.eventParticipants]?: IUser[];
    [IEventItemKeys.eventPriceContent]?: string;
    [IEventItemKeys.eventPriceId]?: number;
    [IEventItemKeys.eventPriceTitle]?: string;
    [IEventItemKeys.eventScheduleContent]?: string;
    [IEventItemKeys.eventScheduleId]?: number;
    [IEventItemKeys.eventScheduleTitle]?: string;
    [IEventItemKeys.eventStart]?: Date;
    [IEventItemKeys.eventTargetGroupContent]?: string;
    [IEventItemKeys.eventTargetGroupId]?: number;
    [IEventItemKeys.eventTargetGroupTitle]?: string;
    [IEventItemKeys.eventTitle]?: string;
    [IEventItemKeys.eventTopic]?: string;
    [IEventItemKeys.imageIds]?: IImage[];
    [IEventItemKeys.requiredAccessLevel]?: number;
}

export function deserializeEventItem(eventItem: IEventItem): IEventItem {
    return {
        ...eventItem,
        [IEventItemKeys.eventEnd]: getDate(eventItem[IEventItemKeys.eventEnd]!, Formats.DATE.DATETIME_DATABASE),
        [IEventItemKeys.eventEnrollmentEnd]: getDate(eventItem[IEventItemKeys.eventEnrollmentEnd]!, Formats.DATE.DATETIME_DATABASE),
        [IEventItemKeys.eventEnrollmentStart]: getDate(eventItem[IEventItemKeys.eventEnrollmentStart]!, Formats.DATE.DATETIME_DATABASE),
        [IEventItemKeys.eventModificationDate]: getDate(eventItem[IEventItemKeys.eventModificationDate]!, Formats.DATE.DATETIME_DATABASE),
        [IEventItemKeys.eventStart]: getDate(eventItem[IEventItemKeys.eventStart]!, Formats.DATE.DATETIME_DATABASE)
    };
}