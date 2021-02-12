import { Exclude, Expose, Transform } from 'class-transformer';
import * as moment from 'moment';

import { DateUtils } from '../utilities/DateUtils';
import { AccountData } from './AccountData';

export class AccountDataPrivate extends AccountData {

    @Expose()
    public userId: number;

    @Expose()
    public displayName: string;

    @Expose()
    @Transform(value => value || null)
    public firstName: string|null;

    @Expose()
    @Transform(value => value || null)
    public lastName: string|null;

    @Expose()
    public eMailAddress: string;

    @Expose()
    @Transform(value => value || null)
    public streetName: string|null;

    @Expose()
    @Transform(value => value || null)
    public houseNumber: string|null;

    @Expose()
    @Transform(value => value || null)
    public zipCode: string|null;

    @Expose()
    @Transform(value => value || null)
    public city: string|null;

    @Expose()
    @Transform(value => value || null)
    public country: string|null;

    @Expose()
    @Transform(value => value || null)
    public phoneNumber: string|null;

    @Expose()
    @Transform(value => DateUtils.toMomentDate(value), { toClassOnly: true })
    @Transform(value => DateUtils.toDBString(value), { toPlainOnly: true })
    public birthdate: moment.Moment|null;

    @Expose()
    @Transform(value => value || null)
    public eatingHabits: string|null;

    @Expose()
    @Transform(value => !!value, { toClassOnly: true })
    @Transform(value => value ? 1 : 0, { toPlainOnly: true })
    public allowPost: boolean;
    
    @Exclude()
    public passwordHash: string;

    @Expose()
    @Transform(value => value || null)
    public sessionHash: string|null;

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

    @Expose()
    @Transform(value => DateUtils.toMoment(value), { toClassOnly: true })
    @Transform(value => DateUtils.toDBString(value), { toPlainOnly: true })
    public modificationDate: moment.Moment|null;
    
}