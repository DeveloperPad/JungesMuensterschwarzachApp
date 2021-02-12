import { Expose } from "class-transformer";

export class EventOffer {

    @Expose()
    public eventOfferId: number;

    @Expose()
    public eventOfferTitle: string;

    @Expose()
    public eventOfferContent: string;

}