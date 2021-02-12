import log from 'loglevel';
import moment from 'moment';

import { IUserKeys } from '../networking/account_data/IUser';
import AccountPushSubscriptionSubscribeRequest from '../networking/account_push_subscriptions/AccountPushSubscriptionSubscribeRequest';
import AccountPushSubscriptionUnsubscribeRequest from '../networking/account_push_subscriptions/AccountPushSubscriptionUnsubscribeRequest';
import { CookieService } from '../services/CookieService';
import Dict from './dict';
import { LogTags } from './log-tags';
import { ConfigService } from '../services/ConfigService';

export function getScrollBarWidth(): number {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    // @deprecated: outer.style.msOverflowStyle = "scrollbar";

    document.body.appendChild(outer);

    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = "scroll";

    const inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);

    const widthWithScroll = inner.offsetWidth;
    outer.parentNode!.removeChild(outer);

    return widthNoScroll - widthWithScroll;
}

export function getContentWidth(): number {
    const app = document.getElementById("app");

    return app ?
        Math.max(
            app.clientWidth,
            app.offsetWidth,
            app.scrollWidth
        ) : 0;
}

export function getContentHeight(withBottomNavigation?: boolean): number {
    let contentHeight = getDocumentHeight();
    const appBar = document.getElementById("jma-app-bar");
    const bottomNav = document.getElementById("jma-bottom-nav");

    if (!appBar) {
        return 0;
    }

    contentHeight -= Math.max(
        appBar.clientHeight,
        appBar.offsetHeight,
        appBar.scrollHeight
    );

    if (bottomNav && withBottomNavigation) {
        // a simple check for bottomNav is not sufficient, as react seems to construct and destruct the DOM in parallel
        contentHeight -= Math.max(
            bottomNav.clientHeight,
            bottomNav.offsetHeight,
            bottomNav.scrollHeight
        );
    }

    return contentHeight;
}

export function getDocumentHeight(): number {
    return Math.max(document.documentElement!.clientHeight, window.innerHeight || 0);
}

export function getDate(date: Date | string, format?: string): Date {
    return typeof date === "string" ?
        format ?
            moment(date, format).toDate() :
            moment(date).toDate()
        : date;
}

export function formatDate(date: Date, format: string | object): string {
    let formattedDateString: string;

    if (date === undefined) {
        formattedDateString = "";
    } else if (typeof format === "string") {
        formattedDateString = moment(date).format(format);
    } else if (format.hasOwnProperty("day")) {
        formattedDateString = date.toLocaleDateString("de-DE", format);
    } else {
        formattedDateString = date.toLocaleTimeString("de-DE", format);
    }

    if (typeof format === "object" && format.hasOwnProperty("hour")) {
        formattedDateString += Dict.date_time_suffix;
    }

    return formattedDateString;
}

export async function registerPushManager(): Promise<void> {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        return Promise.reject("Push subscriptions are not supported by your browser.");
    }

    try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
            return Promise.reject("Service worker registration not found.");
        }

        let subscription = await registration.pushManager.getSubscription();
        if (subscription) {
            log.info(LogTags.PUSH_SUBSCRIPTION + "Loaded existing subscription: " + JSON.stringify(subscription));
        } else {
            log.info(LogTags.PUSH_SUBSCRIPTION + "Acquiring new subscription...");
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(ConfigService.getConfig().PNConfig.SERVER_PUB)
            });
            log.info(LogTags.PUSH_SUBSCRIPTION + "Acquired new subscription: " + JSON.stringify(subscription));
        }

        const endpoint = subscription.endpoint;
        const keys = subscription.toJSON().keys;
        const keyAuth = keys ? keys.auth : "";
        const keyPub = keys ? keys.p256dh : "";
        const userId = await CookieService.get<number>(IUserKeys.userId);
        
        return new Promise<void>((resolve, reject) => {
            new AccountPushSubscriptionSubscribeRequest(
                endpoint,
                keyAuth,
                keyPub,
                userId,
                response => {
                    if (response.successMsg) {
                        log.info(LogTags.PUSH_SUBSCRIPTION + Dict[response.successMsg]);
                        resolve();
                    } else {
                        reject(Dict[response.errorMsg]);
                    }
                },
                error => {
                    reject("Subscription could not be saved in backend: " + error);
                }
            ).execute();
        });
    } catch (error) {
        log.error(LogTags.PUSH_SUBSCRIPTION + "Error while subscribing: " + error);
        return Promise.resolve();
    }
}

export async function unregisterPushManager(): Promise<void> {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        log.info(LogTags.PUSH_SUBSCRIPTION + "Push notifications unsupported, hence skipping.");
        return Promise.resolve();
    }

    try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
            log.info(LogTags.PUSH_SUBSCRIPTION + "Service worker registration not found, hence skipping.");
            return Promise.resolve();
        }

        const subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            log.info(LogTags.PUSH_SUBSCRIPTION + "Push subscription not found, hence skipping.");
            return Promise.resolve();
        }
        
        return new Promise<void>((resolve, reject) => {
            new AccountPushSubscriptionUnsubscribeRequest(
                subscription.endpoint,
                response => {
                    if (response.successMsg) {
                        log.info(LogTags.PUSH_SUBSCRIPTION + Dict[response.successMsg]);
                        resolve();
                    } else {
                        reject(Dict[response.errorMsg]);
                    }
                },
                error => {
                    reject("Subscription could not be deleted from backend: " + error);
                }
            ).execute();
        });
    } catch (error) {
        log.error(LogTags.PUSH_SUBSCRIPTION + "Error while unsubscribing: " + error);
        return Promise.resolve();
    }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}