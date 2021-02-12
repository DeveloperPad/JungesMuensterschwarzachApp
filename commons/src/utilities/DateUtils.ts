import * as moment from 'moment';
import { DateFormats } from '../models/Formats';

export class DateUtils {

    public static toMoment(value: string): moment.Moment {
        return value ? 
            moment(value, DateFormats.ARBITRARY) :
            null;
    }

    public static toMomentDate(value: string): moment.Moment {
        return value ?
            moment(value, DateFormats.ARBITRARY).utc() :
            null;
    }

    public static toDBString(momentObj: moment.Moment): string|null {
        return momentObj ?
            momentObj.format(DateFormats.DB) :
            null;
    }

}