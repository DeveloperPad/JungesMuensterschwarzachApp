import { Expose } from 'class-transformer';

export class EventPrice {

    @Expose()
    public eventPriceId: number;

    @Expose()
    public eventPriceTitle: string;

    @Expose()
    public eventPriceContent: string;

}