import { classToPlain, ClassTransformOptions, plainToClass } from 'class-transformer';
import { AccountData } from 'models/AccountData';
import { AccountDataPrivate } from 'models/AccountDataPrivate';
import { AccountDataPublic } from 'models/AccountDataPublic';

export const cleanOptions: ClassTransformOptions = {
    excludeExtraneousValues: true
}

export function toPrivate(accountData: AccountData): AccountDataPrivate {
    return plainToClass(AccountDataPrivate, classToPlain(accountData, cleanOptions), cleanOptions);
}
export function toPublic(accountData: AccountData): AccountDataPublic {
    return plainToClass(AccountDataPublic, classToPlain(accountData, cleanOptions), cleanOptions);
}