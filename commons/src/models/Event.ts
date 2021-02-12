import { Expose, Transform, Type } from 'class-transformer';
import * as moment from 'moment';

import { DateUtils } from '../utilities/DateUtils';
import { AccessLevels } from './AccessLevels';
import { AccountDataPublic } from './AccountDataPublic';
import { EventArrival } from './EventArrival';
import { EventLocation } from './EventLocation';
import { EventOffer } from './EventOffer';
import { EventPackingList } from './EventPackingList';
import { EventPrice } from './EventPrice';
import { EventSchedule } from './EventSchedule';
import { EventTargetGroup } from './EventTargetGroup';
import { Image } from './Image';

export class Event {

    @Expose()
    public eventId: number;

    @Expose()
    public eventTitle: string;

    @Expose()
    public eventTopic: string;

    @Expose()
    public eventDetails: string;

    @Expose()
    @Transform(value => DateUtils.toMoment(value), { toClassOnly: true })
    @Transform(value => DateUtils.toDBString(value), { toPlainOnly: true })
    public eventStart: moment.Moment;

    @Expose()
    @Transform(value => DateUtils.toMoment(value), { toClassOnly: true })
    @Transform(value => DateUtils.toDBString(value), { toPlainOnly: true })
    public eventEnd: moment.Moment;

    @Expose()
    @Transform(value => DateUtils.toMoment(value), { toClassOnly: true })
    @Transform(value => DateUtils.toDBString(value), { toPlainOnly: true })
    public eventEnrollmentStart: moment.Moment;

    @Expose()
    @Transform(value => DateUtils.toMoment(value), { toClassOnly: true })
    @Transform(value => DateUtils.toDBString(value), { toPlainOnly: true })
    public eventEnrollmentEnd: moment.Moment;

    @Expose()
    @Type(() => EventOffer)
    public eventOffer: EventOffer;

    @Expose()
    @Type(() => EventSchedule)
    public eventSchedule: EventSchedule;

    @Expose()
    @Type(() => EventTargetGroup)
    public eventTargetGroup: EventTargetGroup;

    @Expose()
    @Type(() => EventPrice)
    public eventPrice: EventPrice;

    @Expose()
    @Type(() => EventPackingList)
    public eventPackingList: EventPackingList;

    @Expose()
    @Type(() => EventLocation)
    public eventLocation: EventLocation;

    @Expose()
    @Type(() => EventArrival)
    public eventArrival: EventArrival;

    @Expose()
    @Type(() => Image)
    public images: Image[];

    @Expose()
    @Type(() => AccountDataPublic)
    public participants: AccountDataPublic[];

    @Expose()
    public requiredAccessLevel: AccessLevels;

    @Expose()
    @Type(() => Date)
    public eventModificationDate: Date;
    
}