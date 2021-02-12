import { Expose } from "class-transformer";

export class AccessLevel {
    @Expose()
    public accessLevel: number;
    @Expose()
    public accessIdentifier: string;
}