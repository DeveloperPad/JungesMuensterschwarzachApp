import { Expose, Transform, Type } from 'class-transformer';

import { AccountData } from './AccountData';

export class AccountTransfer {

    @Expose()
    @Type(() => AccountData)
    public user: AccountData;

    @Expose()
    public newEMailAddress: string;

    @Expose()
    @Transform(value => !!value, { toClassOnly: true })
    @Transform(value => value ? 1 : 0, { toPlainOnly: true })
    public oldEMailAddressConfirmed: boolean;


    constructor(user: AccountData, newEMailAddress: string, oldEMailAddressConfirmed: boolean) {
        this.user = user;
        this.newEMailAddress = newEMailAddress;
        this.oldEMailAddressConfirmed = oldEMailAddressConfirmed;
    }
    
}