import { Expose } from "class-transformer";

export class EventArrival {

    @Expose()
    public eventArrivalId: number;
    @Expose()
    public eventArrivalTitle: string;
    @Expose()
    public eventArrivalContent: string;

}