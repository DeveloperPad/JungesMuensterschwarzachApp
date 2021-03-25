<?php
	if (ROOT_LOCAL === null) {
		require_once("../assets/global_requirements.php");
	}
	require_once(ROOT_LOCAL."/modules/DatabaseModule.php");
	require_once(ROOT_LOCAL."/modules/MailModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");

	class NewsletterModule {

		public static function subscribe($eMailAddress) {
			self::cleanUpRegistrations();

			if ($eMailAddress === null) {
				throw new Exception("error_message_NEP");
			}

			if (UserModule::isEMailAddressTaken($eMailAddress, true)) {
				throw new Exception("account_allowNewsletter_registration_account");
			}

			try {
				$registration = self::loadRegistration($eMailAddress);
			} catch (Exception $exc) {
				$registration = null;
			}
			if ($registration !== null && $registration["activateUntil"] === null) {
				throw new Exception("account_allowNewsletter_registration_already");
			}
			self::deleteRegistration($eMailAddress);

			$code = self::createRegistration($eMailAddress);

			MailModule::sendNewsletterConfirmationMail($eMailAddress, $code);

			return "account_allowNewsletter_registration_confirm_sent";
		}

		private static function createRegistration($eMailAddress) {
			$code = self::generateCode();
			$activateUntil = date(DATE_FORMAT_USER_DATE, strtotime("+".TOKEN_DURATION_IN_DAYS." day"));

			$stmt = DatabaseModule::getInstance()->prepare(
				"INSERT INTO
				 newsletter_registrations(eMailAddress, code, activateUntil)
				 VALUES(?, ?, ?)"
			);
			$stmt->bind_param("sss", $eMailAddress, $code, $activateUntil);
			$result = $stmt->execute();
			$stmt->close();

			if ($result === false) {
				throw new Exception("token_creation_failed");
			}

			return $code;
		}

		public static function loadRegistrations() {
			$stmt = DatabaseModule::getInstance()->prepare(
				"(SELECT ad.eMailAddress, ad.accessLevel, al.accessIdentifier, NULL as code
				  FROM account_data ad, access_levels al
				  WHERE ad.accessLevel=al.accessLevel AND allowNewsletter=1)
				 UNION
				 (SELECT nr.eMailAddress, al.accessLevel, al.accessIdentifier, nr.code as code 
				  FROM newsletter_registrations nr, access_levels al
				  WHERE nr.activateUntil IS NULL AND al.accessLevel=10)
				 ORDER BY accessLevel DESC, eMailAddress"
			);

			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}

			$res = $stmt->get_result();
			$newsletterRegistrations = array();
			while ($row = $res->fetch_assoc()) {
				array_push($newsletterRegistrations, $row);
			}
			$stmt->close();

			return $newsletterRegistrations;
		}

		private static function loadRegistration($eMailAddress) {
			$stmt = DatabaseModule::getInstance()->prepare(
				"SELECT * 
				 FROM newsletter_registrations 
				 WHERE eMailAddress=?"
			);
			$stmt->bind_param("s", $eMailAddress);
			
			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}
			$registration = $stmt->get_result()->fetch_assoc();
			$stmt->close();

			if ($registration === null) {
				throw new Exception();
			}
			return $registration;
		}

		public static function redeem($code) {
			self::cleanUpRegistrations();

			$registration = self::getRegistrationByCode($code);
			if ($registration["activateUntil"] !== null) {
				self::activateRegistration($registration["eMailAddress"]);
				return "account_allowNewsletter_registration_confirmed";
			} else {
				self::deleteRegistration($registration["eMailAddress"]);
				return "account_allowNewsletter_registration_canceled";
			}
		}

		private static function activateRegistration($eMailAddress) {
			$code = self::generateCode();
			$activateUntil = null;

			$stmt = DatabaseModule::getInstance()->prepare(
				"UPDATE newsletter_registrations
				 SET code=?, activateUntil=?
				 WHERE eMailAddress=?"
			);
			$stmt->bind_param("sss", $code, $activateUntil, $eMailAddress);
			$result = $stmt->execute();
			$stmt->close();

			if ($result === false) {
				throw new Exception("error_message_try_later");
			}
		}

		private static function getRegistrationByCode($code) {
			$stmt = DatabaseModule::getInstance()->prepare(
				"SELECT * FROM newsletter_registrations WHERE code=?"
			);
			$stmt->bind_param("s", $code);
			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}
			$registration = $stmt->get_result()->fetch_assoc();
			$stmt->close();

			if ($registration === null) {
				throw new Exception("account_allowNewsletter_code_invalid");
			}
			return $registration;
		}

		public static function deleteRegistration($eMailAddress) {
			$stmt = DatabaseModule::getInstance()->prepare(
				"DELETE FROM newsletter_registrations WHERE eMailAddress=?"
			);
			$stmt->bind_param("s", $eMailAddress);
			$result = $stmt->execute();
			$stmt->close();

			if ($result === false) {
				throw new Exception("token_deletion_failed");
			}
		}

		private static function cleanUpRegistrations() {
			if (($res = DatabaseModule::getInstance()->query(
				"SELECT * FROM newsletter_registrations 
				 WHERE activateUntil IS NOT NULL AND DATEDIFF(activateUntil, NOW()) < 0"
				)) === false) {
				throw new Exception("token_cleanup_failed");
			}

			while ($registration = $res->fetch_assoc()) {
				self::deleteRegistration($registration["eMailAddress"]);
			}
		}

		private static function generateCode() {
			return uniqid(random_int(0, 999999999));
		}

	}
?>