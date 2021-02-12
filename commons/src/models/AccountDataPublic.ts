import { Exclude, Expose, Transform } from 'class-transformer';
import * as moment from 'moment';

import { DateUtils } from '../utilities/DateUtils';
import { AccountData } from './AccountData';

export class AccountDataPublic extends AccountData {

    @Expose()
    public userId: number;

    @Expose()
    public displayName: string;

    @Exclude()
    @Transform(() => null)
    public firstName: null;

    @Exclude()
    @Transform(() => null)
    public lastName: null;

    @Exclude()
    public eMailAddress: null;

    @Exclude()
    @Transform(() => null)
    public streetName: null;

    @Exclude()
    @Transform(() => null)
    public houseNumber: null;

    @Exclude()
    @Transform(() => null)
    public zipCode: null;

    @Exclude()
    @Transform(() => null)
    public city: null;

    @Exclude()
    @Transform(() => null)
    public country: null;

    @Exclude()
    @Transform(() => null)
    public phoneNumber: null;

    @Exclude()
    @Transform(() => null)
    public birthdate: null;

    @Exclude()
    @Transform(() => null)
    public eatingHabits: null;

    @Exclude()
    public allowPost: null;
    
    @Exclude()
    public passwordHash: null;

    @Exclude()
    @Transform(() => null)
    public sessionHash: null;

    @Expose()
    @Transform(value => !!value, { toClassOnly: true })
    @Transform(value => value ? 1 : 0, { toPlainOnly: true })
    public isActivated: boolean;

    @Expose()
    public accessLevel: number;

    @Expose()
    @Transform(value => DateUtils.toMoment(value), { toClassOnly: true })
    @Transform(value => DateUtils.toDBString(value), { toPlainOnly: true })
    public registrationDate: moment.Moment;

    @Exclude()
    public modificationDate: null;
    
}