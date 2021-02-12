<?php
    if (ROOT_LOCAL === null) {
		require_once("../assets/global_requirements.php");
    }
    require_once(ROOT_LOCAL."/modules/DatabaseModule.php");
    require_once(ROOT_LOCAL."/modules/UserModule.php");

    class SessionModule {

        public static function signInByCredentials($eMailAddress, $password): array {
            $user = UserModule::signIn($eMailAddress, $password);

            $OTP = self::generateOTP();
            $sessionHash = self::generateSessionHash();

            self::storeOTP($OTP, $user["userId"]);
            self::storeSessionHash($sessionHash, $OTP);

            return array(
                "sessionHash" => $sessionHash,
                "OTP" => $OTP
            );
        }

        public static function signInBySessionHash($sessionHash): array {
            if (!self::isSessionHashValid($sessionHash)) {
                throw new Exception("account_session_expired");
            }

            self::extendSession($sessionHash);
            $OTP = self::getOTPBySessionHash($sessionHash);

            return array(
                "sessionHash" => $sessionHash,
                "OTP" => $OTP
            );
        }

        public static function signInByOTP($OTP): array {
            $oldOTP = $OTP;

            if (!self::isOTPValid($oldOTP)) {
                throw new Exception("account_session_expired");
            }
            
            $newOTP = self::generateOTP();
            $newSessionHash = self::generateSessionHash();
            
            self::deleteSessionHashByOTP($oldOTP);

            self::updateOTP($oldOTP, $newOTP);
            self::storeSessionHash($newSessionHash, $newOTP);

            return array(
                "sessionHash" => $newSessionHash,
                "OTP" => $newOTP
            );
        }

        /* Create */

        private static function storeOTP($OTP, $userId): void {
            $expires = (new DateTime())->add(new DateInterval(SESSION_DURATION_OTP))->format(DATE_FORMAT_DB_FULL);

            $stmt = DatabaseModule::getInstance()->prepare(
				"INSERT INTO
				 account_session_otps(OTP, expires, userId)
                 VALUES(?, ?, ?)"
			);
			$stmt->bind_param("ssi", $OTP, $expires, $userId);
            if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
            }
			$stmt->close();
        }

        private static function storeSessionHash($sessionHash, $OTP): void {
            $expires = (new DateTime())->add(new DateInterval(SESSION_DURATION_HASH))->format(DATE_FORMAT_DB_FULL);

            $stmt = DatabaseModule::getInstance()->prepare(
				"INSERT INTO
				 account_session_hashs(sessionHash, expires, OTP)
                 VALUES(?, ?, ?)"
			);
			$stmt->bind_param("sss", $sessionHash, $expires, $OTP);
            if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
            }
			$stmt->close();
        }

        /* Read */

        private static function isSessionHashValid($sessionHash): bool {
            self::expire();
            
            if ($sessionHash === null) {
                return false;
            }

            $stmt = DatabaseModule::getInstance()->prepare(
                "SELECT 1 FROM account_session_hashs WHERE sessionHash=?"
            );
            $stmt->bind_param("s", $sessionHash);
            if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
            }
            $stmt->store_result();
            
            $isValid = $stmt->num_rows > 0;
            
            $stmt->close();

            return $isValid;
        }

        private static function isOTPValid($OTP): bool {
            self::expire();

            if ($OTP === null) {
                return false;
            }

            $stmt = DatabaseModule::getInstance()->prepare(
                "SELECT 1 FROM account_session_otps WHERE OTP=?"
            );
            $stmt->bind_param("s", $OTP);
            if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
            }
            $stmt->store_result();
            
            $isValid = $stmt->num_rows > 0;
            
            $stmt->close();

            return $isValid;
        }

        public static function getUserIdBySessionHash($sessionHash): int {
            if ($sessionHash === null) {
                throw new Exception("account_session_expired");
            }

            $stmt = DatabaseModule::getInstance()->prepare(
                "SELECT o.userId
                 FROM account_session_hashs h, account_session_otps o
                 WHERE h.OTP=o.OTP AND h.sessionHash=?"
            );
            $stmt->bind_param("s", $sessionHash);

            if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
            }

            $userId = $stmt->get_result()->fetch_assoc()["userId"];

            if ($userId === null) {
                throw new Exception("account_session_expired");
            }

            return $userId;
        }

        private static function getOTPBySessionHash($sessionHash): string {
            if (!$sessionHash) {
                throw new Exception("account_session_expired");
            }

            $stmt = DatabaseModule::getInstance()->prepare(
                "SELECT OTP FROM account_session_hashs WHERE sessionHash=?"
            );
            $stmt->bind_param("s", $sessionHash);

            if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
            }
            
            $session = $stmt->get_result()->fetch_assoc();
            $stmt->close();

            if (!$session) {
                throw new Excpetion("account_session_expired");
            }
            
            return $session["OTP"];
        }

        public static function getOwnAccessLevel(): int {
            if (isset($_COOKIE[CookieModule::getFullName("sessionHash")]) === false) {
                return ACCESS_LEVEL_GUEST;
            }

            try {
                $stmt = DatabaseModule::getInstance()->prepare(
                    "SELECT ad.accessLevel
                     FROM account_data ad, account_session_hashs ash, account_session_otps aso
                     WHERE ad.userId=aso.userId AND aso.OTP=ash.OTP AND ash.sessionHash=?"
                );
                $stmt->bind_param("s", $_COOKIE[CookieModule::getFullName("sessionHash")]);

                if ($stmt->execute() === false) {
                    $stmt->close();
                    throw new Exception("error_message_try_later");
                }

                $user = $stmt->get_result()->fetch_assoc();
                $stmt->close();

                if ($user === null) {
                    throw new Exception("account_id_not_exists");
                }

                return intval($user["accessLevel"]);
            } catch (Exception $exc) {
                return ACCESS_LEVEL_GUEST;
            }
        }

        /* Update */

        private static function updateOTP($oldOTP, $newOTP): void {
            if (!$oldOTP || !$newOTP) {
                throw new Exception("account_session_expired");
            }

            $expires = (new DateTime())->add(new DateInterval(SESSION_DURATION_OTP))->format(DATE_FORMAT_DB_FULL);

            $stmt = DatabaseModule::getInstance()->prepare(
                "UPDATE account_session_otps SET OTP=?, expires=? WHERE OTP=?"
            );
            $stmt->bind_param("sss", $newOTP, $expires, $oldOTP);
            if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
            }
            $stmt->close();
        }

        private static function extendSession($sessionHash): void {
            $OTP = self::getOTPBySessionHash($sessionHash);

            self::extendSessionHash($sessionHash);
            self::extendOTP($OTP);
        }

        private static function extendSessionHash($sessionHash): void {
            if (!$sessionHash) {
                throw new Exception("account_session_expired");
            }

            $expires = (new DateTime())->add(new DateInterval(SESSION_DURATION_HASH))->format(DATE_FORMAT_DB_FULL);

            $stmt = DatabaseModule::getInstance()->prepare(
                "UPDATE account_session_hashs SET expires=? WHERE sessionHash=?"
            );
            $stmt->bind_param("ss", $expires, $sessionHash);
            if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
            }
            $stmt->close();
        }

        private static function extendOTP($OTP): void {
            self::updateOTP($OTP, $OTP);
        }

        /* Delete */

        public static function signOut($sessionHash): void {
            if ($sessionHash === null) {
                return;
            }

            try {
                $OTP = self::getOTPBySessionHash($sessionHash);
                self::deleteOTP($OTP);
                // cascading: self::deleteSessionHashByOTP($OTP);
            } catch (Exception $exc) {
                // suppress deletion error
            }
        }

        private static function deleteOTP($OTP): void {
            if ($OTP === null) {
                return;
            }

            $stmt = DatabaseModule::getInstance()->prepare(
                "DELETE FROM account_session_otps WHERE OTP=?"
            );
            $stmt->bind_param("s", $OTP);
            if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
            }
            $stmt->close();
        }

        private static function deleteSessionHashByOTP($OTP): void {
            if ($OTP === null) {
                return;
            }

            $stmt = DatabaseModule::getInstance()->prepare(
                "DELETE FROM account_session_hashs WHERE OTP=?"
            );
            $stmt->bind_param("s", $OTP);
            if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
            }
            $stmt->close();
        }

        private static function expire(): void {
            self::expireSessionHashs();
            self::expireOTPs();
        }

        private static function expireSessionHashs(): void {
            $now = (new DateTime())->format(DATE_FORMAT_DB_FULL);

            $stmt = DatabaseModule::getInstance()->prepare(
                "DELETE FROM account_session_hashs WHERE expires<?"
            );
            $stmt->bind_param("s", $now);
            if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
            }
            $stmt->close();
        }

        private static function expireOTPs(): void {
            $now = (new DateTime())->format(DATE_FORMAT_DB_FULL);

            $stmt = DatabaseModule::getInstance()->prepare(
                "DELETE FROM account_session_otps WHERE expires<?"
            );
            $stmt->bind_param("s", $now);
            if ($stmt->execute() === false) {
				$stmt->close();
				throw new Exception("error_message_try_later");
            }
            $stmt->close();
        }


        /* Utilities */

        private static function generateSessionHash(): string {
            $sessionHash = "";
            $stmt = DatabaseModule::getInstance()->prepare(
                "SELECT 1 FROM account_session_hashs WHERE sessionHash=?"
            );
            $stmt->bind_param("s", $sessionHash);

            while (true) {
                $sessionHash = self::generateRandomToken();
                $stmt->execute();
                $stmt->store_result();
                
                if ($stmt->num_rows === 0) {
                    break;
                }
            }

            $stmt->close();

            return $sessionHash;
        }

        private static function generateOTP(): string {
            $OTP = "";
            $stmt = DatabaseModule::getInstance()->prepare(
                "SELECT 1 FROM account_session_otps WHERE OTP=?"
            );
            $stmt->bind_param("s", $OTP);

            while (true) {
                $OTP = self::generateRandomToken();
                $stmt->execute();
                $stmt->store_result();
                
                if ($stmt->num_rows === 0) {
                    break;
                }
            }

            $stmt->close();

            return $OTP;
        }

        private static function generateRandomToken(): string {
            return bin2hex(random_bytes(16));
        }
        
    }
?>