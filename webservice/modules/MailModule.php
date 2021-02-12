<?php
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;
	use PHPMailer\PHPMailer\SMTP;

	if (ROOT_LOCAL === null) {
		require_once("../assets/global_requirements.php");
	}
	require_once(ROOT_LOCAL."/modules/UserModule.php");
	require_once(ROOT_LOCAL."/modules/EventModule.php");
	require_once(ROOT_LOCAL."/libs/PHPMailer/PHPMailer.php");
	require_once(ROOT_LOCAL."/libs/PHPMailer/Exception.php");
	require_once(ROOT_LOCAL."/libs/PHPMailer/SMTP.php");

	class MailModule {

		public static function sendSignUpConfirmationMail($eMailAddress, $displayName, $code) {
			$url = self::getRedeemTokenUrl($code);
			$title = $GLOBALS["dict"]["mail_confirm_activation_title"];
			$message = $GLOBALS["dict"]["mail_message_salutation_prefix"] 
				. htmlspecialchars($displayName) 
				. $GLOBALS["dict"]["mail_message_salutation_suffix"]
				. $GLOBALS["dict"]["mail_confirm_activation_message_paragraph_1"]
				. "<a href=\"$url\">$url</a>"
				. $GLOBALS["dict"]["mail_confirm_activation_message_paragraph_2"]
				. $GLOBALS["dict"]["mail_regards"];
			self::sendMail($eMailAddress, $title, $message);
		}

		public static function sendPasswordResetMail($eMailAddress, $displayName, $code) {
			$url = self::getRedeemTokenUrl($code);
			$title = $GLOBALS["dict"]["mail_password_reset_title"];
			$message = $GLOBALS["dict"]["mail_message_salutation_prefix"]
				. htmlspecialchars($displayName)
				. $GLOBALS["dict"]["mail_message_salutation_suffix"]
				. $GLOBALS["dict"]["mail_password_reset_message_paragraph_1"]
				. "<a href=\"$url\">$url</a>"
				. $GLOBALS["dict"]["mail_password_reset_message_paragraph_2"]
				. $GLOBALS["dict"]["mail_regards"];
			self::sendMail($eMailAddress, $title, $message);
		}

		public static function sendOldEMailUpdateMail($eMailAddress, $newEMailAddress, $displayName, $code) {
			$url = self::getRedeemTokenUrl($code);
			$title = $GLOBALS["dict"]["mail_eMailAddress_update_title"];
			$message = $GLOBALS["dict"]["mail_message_salutation_prefix"]
				. htmlspecialchars($displayName)
				. $GLOBALS["dict"]["mail_message_salutation_suffix"]
				. $GLOBALS["dict"]["mail_eMailAddress_update_old_message_paragraph_1"]
				. "<strong>$newEMailAddress</strong>"
				. $GLOBALS["dict"]["mail_eMailAddress_update_old_message_paragraph_2"]
				. "<a href=\"$url\">$url</a>"
				. $GLOBALS["dict"]["mail_eMailAddress_update_old_message_paragraph_3"]
				. $GLOBALS["dict"]["mail_regards"];
			self::sendMail($eMailAddress, $title, $message);
		}

		public static function sendNewEMailUpdateMail($eMailAddress, $displayName, $code) {
			$url = self::getRedeemTokenUrl($code);
			$title = $GLOBALS["dict"]["mail_eMailAddress_update_title"];
			$message = $GLOBALS["dict"]["mail_message_salutation_prefix"]
				. htmlspecialchars($displayName)
				. $GLOBALS["dict"]["mail_message_salutation_suffix"]
				. $GLOBALS["dict"]["mail_eMailAddress_update_new_message_paragraph_1"]
				. "<a href=\"$url\">$url</a>"
				. $GLOBALS["dict"]["mail_eMailAddress_update_new_message_paragraph_2"]
				. $GLOBALS["dict"]["mail_regards"];
			self::sendMail($eMailAddress, $title, $message);
		}

		public static function sendAccountDeletionMail($eMailAddress, $displayName, $code) {
			$url = self::getRedeemTokenUrl($code);

			$title = $GLOBALS["dict"]["mail_account_deletion_title"];
			$message = $GLOBALS["dict"]["mail_message_salutation_prefix"]
				. htmlspecialchars($displayName)
				. $GLOBALS["dict"]["mail_message_salutation_suffix"]
				. $GLOBALS["dict"]["mail_account_deletion_message_paragraph_1"]
				. "<a href=\"$url\">$url</a>"
				. $GLOBALS["dict"]["mail_account_deletion_message_paragraph_2"]
				. $GLOBALS["dict"]["mail_regards"];
			self::sendMail($eMailAddress, $title, $message);
		}

		public static function sendEventEnrollmentNotificationMail($eventId, $userId) {
			try {
				$userList = UserModule::loadUserList(ACCESS_LEVEL_DEVELOPER);
				$enrolledUser = UserModule::loadUser($userId, ACCESS_LEVEL_DEVELOPER);

				$event = EventModule::loadEvent($eventId, ACCESS_LEVEL_DEVELOPER);

				$title = $GLOBALS["dict"]["mail_event_enrollment_notification_title"];
				foreach ($userList as $user) {
					if (intval($user["accessLevel"]) < ACCESS_LEVEL_MODERATOR) {
						continue;
					}

					$message = $GLOBALS["dict"]["mail_message_salutation_prefix"]
						. htmlspecialchars($user["displayName"])
						. $GLOBALS["dict"]["mail_message_salutation_suffix"]
						. "<strong>" . $enrolledUser["firstName"] . " " . $enrolledUser["lastName"] . "</strong>"
						. $GLOBALS["dict"]["mail_event_enrollment_notification_message_paragraph_1"]
						. "<strong>" . $event["eventTitle"] . "</strong>"
						. $GLOBALS["dict"]["mail_event_enrollment_notification_message_paragraph_2"]
						. $GLOBALS["dict"]["mail_event_enrollment_notification_message_paragraph_3"]
						. "<a href=\"" . self::getEventParticipantsUrl($eventId) . "\">" . $GLOBALS["dict"]["event_participants_list"] . "</a>"
						. $GLOBALS["dict"]["mail_event_enrollment_notification_message_paragraph_4"]
						. $GLOBALS["dict"]["mail_regards"];
					try {
						self::sendMail($user["eMailAddress"], $title, $message);
					} catch (Exception $exc) {
						error_log($exc->getMessage());
					}
				}
			} catch(Exception $exc) {
				error_log($exc->getMessage());
			}
		}

		public static function sendEventDisenrollmentNotificationMail($eventId, $userId) {
			try {
				$userList = UserModule::loadUserList(ACCESS_LEVEL_DEVELOPER);
				$disenrolledUser = UserModule::loadUser($userId, ACCESS_LEVEL_DEVELOPER);

				$event = EventModule::loadEvent($eventId, ACCESS_LEVEL_DEVELOPER);

				$title = $GLOBALS["dict"]["mail_event_disenrollment_notification_title"];
				foreach ($userList as $user) {
					if (intval($user["accessLevel"]) < ACCESS_LEVEL_MODERATOR) {
						continue;
					}

					$message = $GLOBALS["dict"]["mail_message_salutation_prefix"]
						. htmlspecialchars($user["displayName"])
						. $GLOBALS["dict"]["mail_message_salutation_suffix"]
						. "<strong>" . htmlspecialchars($disenrolledUser["firstName"]) . " " . htmlspecialchars($disenrolledUser["lastName"]) . "</strong>"
						. $GLOBALS["dict"]["mail_event_disenrollment_notification_message_paragraph_1"]
						. "<strong>" . htmlspecialchars($event["eventTitle"]) . "</strong>"
						. $GLOBALS["dict"]["mail_event_disenrollment_notification_message_paragraph_2"]
						. $GLOBALS["dict"]["mail_regards"];
					try {
						self::sendMail($user["eMailAddress"], $title, $message);
					} catch (Exception $exc) {
						error_log($exc->getMessage());
					}
				}
			} catch(Exception $exc) {
				error_log($exc->getMessage());
			}
		}



		public static function sendMail($recipientAddress, $title, $message) {
			if (MAIL_ACTIVE === false) {
				return;
			}
			
			try {
				$mailer = new PHPMailer(true);
				$mailer->IsHTML(true);
				$mailer->CharSet = MAIL_ENCODING;
				$mailer->isSMTP();
				$mailer->Host = MAIL_SERVER;
				$mailer->SMTPAuth = true;
				$mailer->Username = MAIL_ACCOUNT_NAME;
				$mailer->Password = MAIL_PASSWORD;
				$mailer->Port = MAIL_PORT;
				if (MAIL_PORT === 587) {
					$mailer->SMTPSecure = "tls";
				}

				$mailer->setFrom(MAIL_ADDRESS, MAIL_AUTHOR);
				$mailer->addReplyTo(MAIL_ADDRESS, MAIL_AUTHOR);
				$mailer->addAddress($recipientAddress);

				$mailer->Subject = $title;
				$mailer->Body = $message;
				$mailer->AltBody = $message;

				$mailer->send();
			} catch (Exception $exc) {
				error_log($exc->getMessage());
				throw new Exception("mail_send_fail");
			} finally {
				unset($mailer);
			}
		}

		public static function getRedeemTokenUrl($code) {
			return 
				"http" . (empty($_SERVER["HTTPS"]) === false ? "s" : ""). "://" 
				. $_SERVER["HTTP_HOST"] . MAIL_REDEEM_TOKEN_URL 
				. rawurlencode($code);
		}

		public static function getEventParticipantsUrl($eventId) {
			return 
				"http" . (empty($_SERVER["HTTPS"]) === false ? "s" : ""). "://" 
				. $_SERVER["HTTP_HOST"] . "/app-backend/acp/events_participants.php?eventId="
				. $eventId;
		}
		
	}
?>