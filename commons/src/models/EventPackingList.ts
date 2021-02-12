import { Expose } from 'class-transformer';

export class EventPackingList {

    @Expose()
    public eventPackingListId: number;

    @Expose()
    public eventPackingListTitle: string;

    @Expose()
    public eventPackingListContent: string;

}