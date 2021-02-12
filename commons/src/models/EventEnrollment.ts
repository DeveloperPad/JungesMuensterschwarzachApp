import { Expose, Transform } from 'class-transformer';
import * as moment from 'moment';

import { DateUtils } from '../utilities/DateUtils';
import { AccountData } from './AccountData';
import { Event } from './Event';

export class EventEnrollment {

    @Expose()
    public enrollmentId: number;

    @Expose()
    public event: Event;

    @Expose()
    public user: AccountData;

    @Expose()
    public eventEnrollmentComment: string;

    @Expose()
    @Transform(value => DateUtils.toMoment(value), { toClassOnly: true })
    @Transform(value => DateUtils.toDBString(value), { toPlainOnly: true })
    public enrollmentDate: moment.Moment;

}