import { Expose, Transform, Type } from 'class-transformer';
import * as moment from 'moment';

import { DateUtils } from '../utilities/DateUtils';
import { AccountData } from './AccountData';
import { AccountTokenTypes } from './AccountTokenTypes';

export class AccountToken {

    @Expose()
    public code: string;

    @Expose()
    public tokenType: AccountTokenTypes;

    @Expose()
    @Type(() => AccountData)
    public user: AccountData;

    @Expose()
    @Transform(value => DateUtils.toMoment(value), { toClassOnly: true })
    @Transform(value => DateUtils.toDBString(value), { toPlainOnly: true })
    public validUntil: moment.Moment;


    constructor(code: string, tokenType: AccountTokenTypes, user: AccountData, validUntil: moment.Moment) {
        this.code = code;
        this.tokenType = tokenType;
        this.user = user;
        this.validUntil = validUntil;
    }
    
}