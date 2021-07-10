<?php
	if (ROOT_LOCAL === null) {
		require_once("../assets/global_requirements.php");
	}
	require_once(ROOT_LOCAL."/modules/EventModule.php");
	require_once(ROOT_LOCAL."/modules/NewsModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");

	class AlexaNotificationModule {

		public static function sendUserActivationNotification($userId) {
			$user = UserModule::loadUser($userId, ACCESS_LEVEL_DEVELOPER);

			$data = array(
				"displayName" => $user["displayName"]
			);

			self::sendAlexaNotification(AN_URL_USER_ACTIVATION, $data);
		}

		public static function sendEventAnnouncementNotification($eventId) {
			$event = EventModule::loadEvent($eventId, ACCESS_LEVEL_DEVELOPER);

			$data = array(
				"eventTitle" => $event["eventTitle"]
			);

			self::sendAlexaNotification(AN_URL_EVENT_ANNOUNCEMENT, $data);
		}

		public static function sendEventEnrollmentNotification($eventId, $userId) {
			$event = EventModule::loadEvent($eventId, ACCESS_LEVEL_DEVELOPER);
			$user = UserModule::loadUser($userId, ACCESS_LEVEL_DEVELOPER);

			$data = array(
				"action" => "enrolled",
				"displayName" => $user["displayName"],
				"eventTitle" => $event["eventTitle"]
			);

			self::sendAlexaNotification(AN_URL_EVENT_ENROLLMENT, $data);
		}
		public static function sendEventDisenrollmentNotification($eventId, $userId) {
			$event = EventModule::loadEvent($eventId, ACCESS_LEVEL_DEVELOPER);
			$user = UserModule::loadUser($userId, ACCESS_LEVEL_DEVELOPER);

			$data = array(
				"action" => "disenrolled",
				"displayName" => $user["displayName"],
				"eventTitle" => $event["eventTitle"]
			);

			self::sendAlexaNotification(AN_URL_EVENT_ENROLLMENT, $data);
		}

		public static function sendNewsAnnouncementNotification($newsId) {
			$news = NewsModule::loadNewsArticle($newsId, ACCESS_LEVEL_DEVELOPER);

			$data = array(
				"newsTitle" => $news["title"]
			);

			self::sendAlexaNotification(AN_URL_NEWS_ANNOUNCEMENT, $data);
		}

		private static function sendAlexaNotification($webhook, $data) {
			if (empty(AN_URL_BASE) === true) {
				return;
			}

			$ch = curl_init($webhook);
			$payload = json_encode($data);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
			curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type:application/json"));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_exec($ch);
			curl_close($ch);
		}
		
	}
?>