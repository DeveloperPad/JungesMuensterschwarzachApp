import { Expose } from "class-transformer";

export class Image {

    @Expose()
    public imageId: number;

    @Expose()
    public path: string;

}