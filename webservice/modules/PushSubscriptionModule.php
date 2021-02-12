<?php
	if (ROOT_LOCAL === null) {
		require_once("../assets/global_requirements.php");
	}
	require_once(ROOT_LOCAL."/modules/DatabaseModule.php");

	class PushSubscriptionModule {

		public static function subscribe($endpoint, $keyAuth, $keyPub, $userId) {
			self::validateEndpoint($endpoint);
			self::validateKeyAuth($keyAuth);
			self::validateKeyPub($keyPub);

			$stmt = DatabaseModule::getInstance()->prepare(
				"INSERT INTO account_push_subscriptions VALUES (?, ?, ?, ?)
				 ON DUPLICATE KEY UPDATE keyAuth=?, keyPub=?, userId=?"
			);
			$stmt->bind_param(
				"sssissi", 
				$endpoint, $keyAuth, $keyPub, $userId,
				$keyAuth, $keyPub, $userId
			);
			$result = $stmt->execute();
			$stmt->close();
			if ($result === false) {
				throw new Exception("account_id_not_exists");
			}
		}

		public static function loadSubscriptionsByAccessLevel($requiredAccessLevel) {
			if ($requiredAccessLevel === null || is_numeric($requiredAccessLevel) === false) {
				throw new Exception("event_requiredAccessLevel_not_exist");
			}

			$stmt = DatabaseModule::getInstance()->prepare(
				"(SELECT aps.endpoint, aps.keyAuth, aps.keyPub
				 FROM account_data ad, account_push_subscriptions aps
				 WHERE ad.userId=aps.userId AND ad.accessLevel>=?) " .
				 ($requiredAccessLevel <= ACCESS_LEVEL_GUEST ? 
				 "UNION DISTINCT (SELECT endpoint, keyAuth, keyPub FROM account_push_subscriptions WHERE userId IS NULL)" : "")
			);
			$stmt->bind_param("i", $requiredAccessLevel);

			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}

			$subscriptions = array();

			$res = $stmt->get_result();
			while ($subscription = $res->fetch_assoc()) {
				array_push($subscriptions, $subscription);
			}
			$stmt->close();

			return $subscriptions;
		}

		public static function unsubscribe($endpoint) {
			self::validateEndpoint($endpoint);

			$stmt = DatabaseModule::getInstance()->prepare(
				"DELETE FROM account_push_subscriptions WHERE endpoint=?"
			);
			$stmt->bind_param("s", $endpoint);
			$result = $stmt->execute();
			$stmt->close();
			if ($result === false) {
				throw new Exception("error_message_try_later");
			}
		}

		private static function validateEndpoint($endpoint) {
			if (empty($endpoint)) {
				throw new Exception("account_push_subscription_endpoint_invalid");
			}
		}

		private static function validateKeyAuth($keyAuth) {
			if (empty($keyAuth)) {
				throw new Exception("account_push_subscription_keyAuth_invalid");
			}
		}

		private static function validateKeyPub($keyPub) {
			if (empty($keyPub)) {
				throw new Exception("account_push_subscription_keyPub_invalid");
			}
		}

	}
?>