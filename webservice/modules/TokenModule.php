<?php
	if (ROOT_LOCAL === null) {
		require_once("../assets/global_requirements.php");
	}
	require_once(ROOT_LOCAL."/modules/DatabaseModule.php");
	require_once(ROOT_LOCAL."/modules/TransferModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");
	require_once(ROOT_LOCAL."/modules/WebsiteEnrollmentModule.php");

	class TokenModule {

		const TOKEN_TYPE_ACTIVATION = "ACTIVATION";
		const TOKEN_TYPE_PASSWORD_RESET = "PASSWORD_RESET";
		const TOKEN_TYPE_E_MAIL_UPDATE = "E_MAIL_UPDATE";
		const TOKEN_TYPE_EVENT_ENROLLMENT = "EVENT_ENROLLMENT";
		const TOKEN_TYPE_DELETION = "DELETION";


		public static function getCode($userId, $tokenType) {
			self::cleanUpTokens();

			$token = self::getTokenByUserId($userId);

			if ($token === null) {
				$code = self::createToken($userId, $tokenType);
			} else if ($token["tokenType"] !== $tokenType) {
				if ($token["tokenType"] === self::TOKEN_TYPE_ACTIVATION) {
					throw new Exception("account_isActivated_not");
				}
				self::expireToken($token);
				$code = self::createToken($userId, $tokenType);
			} else {
				$code = $token["code"];
			}
			
			return $code;
		}

		public static function getTokenByUserId($userId) {
			self::cleanUpTokens();

			$stmt = DatabaseModule::getInstance()->prepare(
				"SELECT * FROM account_tokens WHERE userId=?"
			);
			$stmt->bind_param("i", $userId);
			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}
			$token = $stmt->get_result()->fetch_assoc();
			$stmt->close();

			return $token;
		}

		public static function cleanUpTokens() {
			if (($res = DatabaseModule::getInstance()->query(
				"SELECT * FROM account_tokens WHERE DATEDIFF(validUntil, NOW()) < 0"
										 )) === false) {
				throw new Exception("token_cleanup_failed");
			}

			while ($token = $res->fetch_assoc()) {
				self::expireToken($token);
			}
		}

		public static function expireToken($token) {
			if ($token === null) {
				return;
			}

			$userId = $token["userId"];

			if ($token["tokenType"] === self::TOKEN_TYPE_ACTIVATION) {
				try {
					$user = UserModule::loadUser($userId, ACCESS_LEVEL_DEVELOPER);
					if ($user["isActivated"] === 0) {
						UserModule::deleteUser($userId);
					}
					WebsiteEnrollmentModule::expireEnrollmentMail($user["eMailAddress"]);
				} catch (Exception $exc) {
					throw new Exception("token_cleanup_failed");
				}
			} else if ($token["tokenType"] === self::TOKEN_TYPE_E_MAIL_UPDATE) {
				try {
					TransferModule::deleteTransfer($userId);
				} catch(Exception $exc) {
					throw new Exception("token_cleanup_failed");
				}
			} else if ($token["tokenType"] === self::TOKEN_TYPE_EVENT_ENROLLMENT) {
				$user = UserModule::loadUser($userId, ACCESS_LEVEL_DEVELOPER);
				WebsiteEnrollmentModule::expireEnrollmentMail($user["eMailAddress"]);
			}

			self::deleteToken($token);
		}

		public static function deleteToken($token) {
			$stmt = DatabaseModule::getInstance()->prepare(
				"DELETE FROM account_tokens WHERE userId=?"
			);
			$stmt->bind_param("i", $token["userId"]);
			$result = $stmt->execute();
			$stmt->close();

			if ($result === false) {
				throw new Exception("token_deletion_failed");
			}
		}

		private static function createToken($userId, $tokenType) {
			$code = uniqid(random_int(0, 999999999));
			$validUntil = date(DATE_FORMAT_USER_DATE, strtotime("+".TOKEN_DURATION_IN_DAYS." day"));

			$stmt = DatabaseModule::getInstance()->prepare(
				"INSERT INTO
				 account_tokens(code, tokenType, userId, validUntil)
				 VALUES(?, ?, ?, ?)"
			);
			$stmt->bind_param("ssis", $code, $tokenType, $userId, $validUntil);
			$result = $stmt->execute();
			$stmt->close();

			if ($result === false) {
				throw new Exception("token_creation_failed");
			}
			return $code;
		}


		public static function redeemToken($code) {
			$token = self::getTokenByCode($code);
			
			switch ($token["tokenType"]) {
				case self::TOKEN_TYPE_ACTIVATION:
					$user = UserModule::loadUser($token["userId"], ACCESS_LEVEL_DEVELOPER);
					WebsiteEnrollmentModule::applyEnrollmentMail($user["eMailAddress"]);
					UserModule::updateIsActivated($token["userId"], 1);
					self::deleteToken($token);
					break;
				case self::TOKEN_TYPE_EVENT_ENROLLMENT:
					$user = UserModule::loadUser($token["userId"], ACCESS_LEVEL_DEVELOPER);
					WebsiteEnrollmentModule::applyEnrollmentMail($user["eMailAddress"]);
					self::deleteToken($token);
					break;
				case self::TOKEN_TYPE_PASSWORD_RESET:
					// user can update it's password now and the token gets deleted afterwards
					break;
				case self::TOKEN_TYPE_E_MAIL_UPDATE:
					TransferModule::processConfirmation($token["userId"]);
					break;
				case self::TOKEN_TYPE_DELETION:
					UserModule::deleteUser($token["userId"]);
					self::deleteToken($token);
					break;
				default:
					throw new Exception("token_type_invalid");
					break;
			}

			return $token;
		}

		public static function getTokenByCode($code) {
			self::cleanUpTokens();

			$stmt = DatabaseModule::getInstance()->prepare(
				"SELECT * FROM account_tokens WHERE code=?"
			);
			$stmt->bind_param("s", $code);
			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}
			$token = $stmt->get_result()->fetch_assoc();
			$stmt->close();

			if ($token === null) {
				throw new Exception("token_code_invalid");
			}
			return $token;
		}

		public static function getTokenList() {
			$stmt = DatabaseModule::getInstance()->prepare(
				"SELECT t.*, d.displayName FROM account_tokens t, account_data d 
				WHERE t.userId=d.userId ORDER BY t.validUntil DESC, t.tokenType ASC"
			);

			if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
			}
			$res = $stmt->get_result();

			$tokenList = array();
			while ($token = $res->fetch_assoc()) {
				array_push($tokenList, $token);
			}

			$stmt->close();
			return $tokenList;
		}

	}
?>