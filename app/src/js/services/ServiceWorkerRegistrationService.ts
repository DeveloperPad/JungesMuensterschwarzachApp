import * as log from 'loglevel';

import { showNotification } from '../components/utilities/Notifier';
import Dict from '../constants/dict';
import { LogTags } from '../constants/log-tags';


export class ServiceWorkerRegistrationService {

  public static register(): void {
    if ("serviceWorker" in navigator) {
      const publicUrl = new URL(
        process.env.PUBLIC_URL!,
        window.location.toString()
      );

      if (publicUrl.origin !== window.location.origin) {
        return;
      }

      window.addEventListener("load", () => {
        this.registerSW(process.env.PUBLIC_URL + "/sw.js");
      });
    }
  }

  private static registerSW(swUrl: string): void {
    navigator.serviceWorker.register(swUrl);
    navigator.serviceWorker.ready.then(registration => {
      registration.onupdatefound = () => {
        this.handleSWUpdate(registration);
      }
    });
  }

  private static handleSWUpdate(registration: any): void {
    if (!registration) {
      return;
    }

    const newWorker = registration.installing;

    if (newWorker) {
      newWorker.addEventListener("statechange", () => {
        switch (newWorker.state) {
          case "installed":
            if (navigator.serviceWorker.controller) {
              this.handleSWUpdated();
            } else {
              this.handleSWInstalled();
            }
            break;
        }
      });
    }
  };

  private static handleSWInstalled(): void {
    log.info(LogTags.SERVICE_WORKER + Dict.app_serviceWorker_cache_saved)
    showNotification(Dict.app_serviceWorker_cache_saved);
  }

  private static handleSWUpdated(): void {
    log.warn(LogTags.SERVICE_WORKER + Dict.app_serviceWorker_update_available)
    showNotification(Dict.app_serviceWorker_update_available);
    setTimeout(
      () => {
        window.location.reload();
      },
      4000
    );
  }

  public static unregister(): void {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.unregister();
      });
    }
  }

}