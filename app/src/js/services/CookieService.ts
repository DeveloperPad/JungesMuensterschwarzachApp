import * as log from 'loglevel';
import Cookies from 'universal-cookie';

import { LogTags } from '../constants/log-tags';

export class CookieService {

    public static set<T>(key: string, value: T): Promise<void> {
        log.debug(LogTags.COOKIE_SERVICE + "added/updated cookie information: \"" + key + "\" (KEY) to \"" + value + "\" (VALUE).");
        new Cookies().set(
            CookieService.getFullName(key),
            value,
            {
                path: "/",
                expires: new Date(2147483647000),
                maxAge: Math.floor((2147483647000 - Date.now()) / 1000),
                secure: CookieService.isSecureConnection(),
                httpOnly: false,
                sameSite: false
            }
        )
        return Promise.resolve();
    }

    public static get<T>(key: string): Promise<T|null> {
        const value: T = new Cookies().get(CookieService.getFullName(key));
        return Promise.resolve(value === undefined ? null : value);
    }

    public static remove(key: string): Promise<void> {
        log.debug(LogTags.COOKIE_SERVICE + "removed cookie information: \"" + key + "\" (KEY).");
        new Cookies().remove(
            CookieService.getFullName(key),
            {
                path: "/",
                secure: CookieService.isSecureConnection(),
                httpOnly: false,
                sameSite: false
            }
        );
        return Promise.resolve();
    }

    private static getFullName(nameWOPrefix: string): string {
        return CookieService.isSecureConnection() ?
            "__Secure-" + nameWOPrefix :
            nameWOPrefix;
    }

    private static isSecureConnection(): boolean {
        return window.location.protocol === "https:";
    }

}