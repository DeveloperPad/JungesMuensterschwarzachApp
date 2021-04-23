importScripts("./js/dict.js");

async function loadConfig() {
  return fetch("./js/app.json")
    .then(response => response.json());
}

self.addEventListener("pushsubscriptionchange", e => {
  e.waitUntil(handleSubscriptionChange());
});

async function handleSubscriptionChange() {
  console.log("[SERVICE WORKER] \tNew push subscription received.");

  if (!("pushManager" in self.registration)) {
    console.log("[SERVICE WORKER] \tPush Notifications are not supported.");
    return Promise.reject();
  }

  return loadConfig().then(config => {
    return Promise.all([getSubscription(config), getUserId()]).then(
      async values => {
        const subscription = values[0];
        const userId = values[1];

        const data = new URLSearchParams();
        data.append("action", "subscribe");
        data.append("endpoint", subscription.endpoint);
        data.append("keyAuth", subscription.toJSON().keys ? subscription.toJSON().keys.auth : "")
        data.append("keyPub", subscription.toJSON().keys ? subscription.toJSON().keys.p256dh : "");
        data.append("userId", userId);
        

        const response = await fetch(config.BaseUrls.WEBSERVICE + "/account_push_subscriptions.php", {
          method: "POST",
          body: data
        });
        const text = await response.text();
        const res = JSON.parse(text);
        if (res.successMsg) {
          console.log("[SERVICE WORKER] \t" + self.Dict[res.successMsg]);
        } else {
          console.log("[SERVICE WORKER] \t" + self.Dict[res.errorMsg]);
        }
        return await Promise.resolve();
      },
      error => {
        console.log("[SERVICE WORKER] \tPush Subscription could not be updated: " + error);
        return Promise.reject();
      }
    );
  });
}

async function getSubscription(config) {
  let subscription = await self.registration.pushManager.getSubscription();

  if (subscription) {
    console.log("[SERVICE WORKER] \tLoaded existing subscription: " + JSON.stringify(subscription));
  } else {
    console.log("[SERVICE WORKER] \tAcquiring new subscription...");
    subscription = await self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(config.PNConfig.SERVER_PUB)
    });
    console.log("[SERVICE WORKER] \tAcquired new subscription: " + JSON.stringify(subscription));
  }

  return subscription;
}

async function getUserId() {
  return Promise.resolve((document.cookie.match(/^(?:.*;)?\s*(__Secure-)?userId\s*=\s*([^;]+)(?:.*)?$/)||[,,null])[2]);
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

self.addEventListener("install", e => {
  self.skipWaiting();
  console.log("[SERVICE WORKER] \tWaiting after new installation skipped.");
});

self.addEventListener("push", e => {
  const payload = e.data.json();
  console.log("[SERVICE WORKER] \tPush received: " + JSON.stringify(payload));

  e.waitUntil(
    self.registration.showNotification(
      self.Dict.hasOwnProperty(payload.title) ? self.Dict[payload.title] : payload.title,
        {
          badge: "./icons/badge.png",
          body: self.Dict.hasOwnProperty(payload.body) ? self.Dict[payload.body] : payload.body,
          data: payload,
          icon: "./icons/192x192.png",
          timestamp: new Date().getMilliseconds(),
          vibrate: [250, 250, 250, 250]
        }
    )
  )
});

self.addEventListener("notificationclick", async e => {
  console.log("[SERVICE WORKER] \tNotification click received: " + JSON.stringify(e));
  const notification = e.notification;
  notification.close();

  if (!notification.data || !notification.data.click_action) {
    return;
  }

  return e.waitUntil(clients.openWindow(notification.data.click_action));
});