import * as moment from 'moment';

export class DateFormats {
    public static DB: string = "YYYY-MM-DD HH:mm:ss";
    public static INPUT: string = moment.HTML5_FMT.DATETIME_LOCAL_SECONDS;
    public static ARBITRARY: string[] = [
        DateFormats.DB,
        DateFormats.INPUT
    ];
}