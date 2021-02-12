import { Expose } from "class-transformer";

export class Success {

    @Expose()
    private message: string;


    public constructor(message: string) {
        this.message = message;
    }

    public getMessage(): string {
        return this.message;
    }

}