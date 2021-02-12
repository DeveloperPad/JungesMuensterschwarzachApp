import { Expose } from "class-transformer";

export class EventTargetGroup {

    @Expose()
    public eventTargetGroupId: number;

    @Expose()
    public eventTargetGroupTitle: string;

    @Expose()
    public eventTargetGroupContent: string;

}