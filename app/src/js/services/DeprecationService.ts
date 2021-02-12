import * as log from 'loglevel';

import { LogTags } from '../constants/log-tags';

export class DeprecationService {

    public static run(): void {
        this.removeOldWorkboxCaches();
        this.removeFirebaseIndexedDBs();
    }

    private static removeOldWorkboxCaches(): void {
        caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
                if (cacheName.startsWith("workbox-precache-v2")) {
                    caches.delete(cacheName);
                    log.info(LogTags.DEPRECATION + "Found and removed old v2 workbox cache.");
                }
            });
        });
    }

    private static removeFirebaseIndexedDBs(): void {
        indexedDB.deleteDatabase("firebase-installations-database");
        indexedDB.deleteDatabase("firebase-messaging-database");
        log.info(LogTags.DEPRECATION + "Removed old firebase indexedDBs, if they were still present.");
    }

}