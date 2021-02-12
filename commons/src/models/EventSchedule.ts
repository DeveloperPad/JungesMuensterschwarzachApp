import { Expose } from 'class-transformer';

export class EventSchedule {

    @Expose()
    public eventScheduleId: number;

    @Expose()
    public eventScheduleTitle: string;

    @Expose()
    public eventScheduleContent: string;

}