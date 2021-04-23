<?php
	use Minishlink\WebPush\WebPush;
	use Minishlink\WebPush\Subscription;

	if (ROOT_LOCAL === null) {
		require_once("../assets/global_requirements.php");
	}
	require_once(ROOT_LOCAL."/modules/PushSubscriptionModule.php");
	require_once(ROOT_LOCAL."/modules/NewsModule.php");
	require_once(ROOT_LOCAL."/modules/EventModule.php");
	require_once(ROOT_LOCAL."/libs/WebPushPHP/autoload.php");

	class PushNotificationModule {

		public static function sendNewsNotification($newsId, $ownAccessLevel) {
			$news = NewsModule::loadNewsArticle($newsId, $ownAccessLevel);

			$payload = new stdClass();
			$payload->title = "pn_receive_news";
			$payload->body = $news["title"];
			$payload->click_action = APP_BASEURLS_APP . "/news/" . $news["newsId"];

			return self::sendPushNotification($news["requiredAccessLevel"], $payload);
		}

		public static function sendEventNotification($eventId, $ownAccessLevel) {
			$event = EventModule::loadEvent($eventId, $ownAccessLevel);

			$payload = new stdClass();
			$payload->title = "pn_receive_event";
			$payload->body = $event["eventTitle"];
			$payload->click_action = APP_BASEURLS_APP . "/events/" . $event["eventId"];

			return self::sendPushNotification($event["requiredAccessLevel"], $payload);
		}

		public static function sendCustomNotification($requiredAccessLevel, $title, $body, $ownAccessLevel) {
			if ($ownAccessLevel < $requiredAccessLevel) {
				throw new Exception("account_accessLevel_invalid");
			}

			$payload = new stdClass();
			$payload->title = $title;
			$payload->body = $body;
			$payload->click_action = APP_BASEURLS_APP;

			return self::sendPushNotification($requiredAccessLevel, $payload);
		}

		private static function sendPushNotification($requiredAccessLevel, $payload) {
			self::validatePayload($payload);

			$subscriptions = PushSubscriptionModule::loadSubscriptionsByAccessLevel($requiredAccessLevel);

			$webPush = new WebPush(
				[
					"VAPID" => [
						"subject" => "mailto:lucas@luckev.info",
						"privateKey" => PN_KEYS_PRIVATE,
						"publicKey" => PN_KEYS_PUBLIC
					]
				],
				[
					"TTL" => 259200, // 3d
					"urgency" => "normal",
					"batchSize" => 200
				]
			);
			$webPush->setReuseVAPIDHeaders(true);
			$webPush->setAutomaticPadding(false); // msgs for firefox an android are too large with padding

			$all = 0;
			foreach ($subscriptions as $subscription) {
				$all++;
				$webPush->queueNotification(
					Subscription::create([
						"endpoint" => $subscription["endpoint"],
						"authToken" => $subscription["keyAuth"],
						"publicKey" => $subscription["keyPub"],
						"contentEncoding" => PN_PAYLOAD_ENCODING
					]),
					json_encode($payload)
				);
			}

			$successful = 0;
			$expired = 0;
			$errorMsgs = "";
			foreach ($webPush->flush() as $report) {
				if ($report->isSubscriptionExpired()) {
					$expired++;
					PushSubscriptionModule::unsubscribe($report->getEndpoint());
				}

				if ($report->isSuccess()) {
					$successful++;
				} else {
					$errorMsgs .= "<br/><br/>" . $report->getEndPoint() . "\t" . $report->getReason();
				}
			}

			return 
				$all . $GLOBALS["dict"]["account_push_notifications_sent_prefix"] .
				$successful . $GLOBALS["dict"]["account_push_notifications_sent_successful"] .
				($all - $successful) . $GLOBALS["dict"]["account_push_notifications_sent_failed"] .
				$expired . $GLOBALS["dict"]["account_push_notifications_sent_expired"] .
				(empty($errorMsgs) ? "" : 
					"<br/><br/>" . $GLOBALS["dict"]["label_failure"] . $errorMsgs);
		}

		private static function validatePayload($payload) {
			self::validatePayloadTitle($payload->title);
			self::validatePayloadBody($payload->body);
		}

		private static function validatePayloadTitle($title) {
			if (isset($title) === false || empty($title) === true || strlen($title) > PN_TITLE_MAX_LENGTH) {
				throw new Exception("pn_send_notification_title_invalid");
			}
		}

		private static function validatePayloadBody($body) {
			if (isset($body) === false || empty($body) === true || strlen($body) > PN_BODY_MAX_LENGTH) {
				throw new Exception("pn_send_notification_body_invalid");
			}
		}
		
	}
?>