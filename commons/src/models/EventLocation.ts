import { Expose, Transform } from 'class-transformer';

export class EventLocation {

    @Expose()
    public eventLocationId: number;

    @Expose()
    public eventLocationTitle: string;

    @Expose()
    @Transform(value => parseFloat(value), { toClassOnly: true })
    public eventLocationLatitude: number;

    @Expose()
    @Transform(value => parseFloat(value), { toClassOnly: true })
    public eventLocationLongitude: number;

}