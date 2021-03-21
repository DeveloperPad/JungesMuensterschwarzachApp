<?php
	if (ROOT_LOCAL === null) {
		require_once("../assets/global_requirements.php");
	}
	require_once(ROOT_LOCAL."/modules/DatabaseModule.php");
	require_once(ROOT_LOCAL."/modules/NewsletterModule.php");
	require_once(ROOT_LOCAL."/modules/TokenModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");

	class TransferModule {

		public static function initiateTransfer($userId, $newEMailAddress) {
			$stmt = DatabaseModule::getInstance()->prepare(
				"INSERT INTO account_transfers(userId, newEMailAddress) VALUES (?, ?)"
			);
			$stmt->bind_param("is", $userId, $newEMailAddress);
			$result = $stmt->execute();
			$stmt->close();
			
			if ($result === false) {
				throw new Exception("account_transfer_not_initialized");
			}
		}

		public static function getTransfer($userId) {
			$stmt = DatabaseModule::getInstance()->prepare(
				"SELECT * FROM account_transfers WHERE userId=?"
			);
			$stmt->bind_param("i", $userId);
			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}
			$transfer = $stmt->get_result()->fetch_assoc();
			$stmt->close();

			if ($transfer === null) {
				throw new Exception("account_transfer_not_exists");
			}
			return $transfer;
		}

		public static function processConfirmation($userId) {
			$user = UserModule::loadUser($userId, ACCESS_LEVEL_DEVELOPER);
			$transfer = self::getTransfer($userId);

			if (intval($transfer["oldEMailAddressConfirmed"]) === 0) {
				self::updateOldEMailAddressConfirmed($userId, 1);
				TokenModule::deleteToken(TokenModule::getTokenByUserId($userId));
				UserModule::requestAccountTransferMail($user["eMailAddress"]);
				CookieModule::set("alert", new Alert("warning", $GLOBALS["dict"]["account_transfer_progressed"]));
			} else {
				UserModule::updateEMailAddress($userId, $transfer["newEMailAddress"]);
				self::deleteTransfer($userId);
				TokenModule::deleteToken(TokenModule::getTokenByUserId($userId));
				NewsletterModule::deleteRegistration($transfer["newEMailAddress"]);
				CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_eMailAddress_updated"]));
			}
		}

		private static function updateOldEMailAddressConfirmed($userId, $oldEMailAddressConfirmed) {
			$stmt = DatabaseModule::getInstance()->prepare(
				"UPDATE account_transfers SET oldEMailAddressConfirmed=? WHERE userId=?"
			);
			$stmt->bind_param("ii", $oldEMailAddressConfirmed, $userId);
			$result = $stmt->execute();
			$stmt->close();
			
			if ($result === false) {
				throw new Exception("error_message_try_later");
			}
		}

		public static function deleteTransfer($userId) {
			$stmt = DatabaseModule::getInstance()->prepare(
				"DELETE FROM account_transfers WHERE userId=?"
			);
			$stmt->bind_param("i", $userId);
			$result = $stmt->execute();
			$stmt->close();

			if ($result === false) {
				throw new Exception("error_message_try_later");
			}
		}
		
	}
?>