<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");
	require_once(ROOT_LOCAL."/modules/TokenModule.php");
	require_once(ROOT_LOCAL."/modules/TransferModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");
	require_once(ROOT_LOCAL."/endpoints/response.php");
	
	$response = new Response();
	try {
		if (isset($_POST["action"]) === false) {
			throw new Exception("error_type_client");
		}

		$_POST["action"]($response);
	} catch (Exception $exc) {
		$response->setErrorMsg($exc->getMessage());
	}
	echo(json_encode($response));

	function signUp($response) {
		UserModule::signUp(
			$_POST["displayName"], $_POST["eMailAddress"], 
			$_POST["password"], $_POST["password"],
			$_POST["allowNewsletter"]
		);
		$response->setSuccessMsg("mail_confirm_activation_send");
	}

	function fetch($response) {
		if (isset($_COOKIE[CookieModule::getFullName("sessionHash")]) === false) {
			throw new Exception("error_message_NEP");
		}
		
		$user = UserModule::loadUserBySessionHash(
			$_COOKIE[CookieModule::getFullName("sessionHash")],
			ACCESS_LEVEL_DEVELOPER
		);
		$response->setUser(
			array_intersect_key(
				$user, 
				array_flip(array("userId", "firstName", "lastName", "displayName", "eMailAddress", "streetName", "houseNumber", 
					"zipCode", "city", "country", "phoneNumber", "birthdate", "eatingHabits", "allowPost", "allowNewsletter", "accessIdentifier"))
			)
		);
	}

	function update($response) {
		if (isset($_COOKIE[CookieModule::getFullName("sessionHash")]) === false) {
			throw new Exception("error_message_NEP");
		}

		$userId = SessionModule::getUserIdBySessionHash($_COOKIE[CookieModule::getFullName("sessionHash")]);
		
		foreach ($_POST as $key => $value) {
			if ($key === "action") {
				continue;
			}

			if (isset($value) === true) {
				$funcName = "update".ucfirst($key);

				if ($key === "eMailAddress") {
					UserModule::initiateAccountTransfer($userId, $value);
					$response->setSuccessMsg("account_transfer_initialized");
				} else if ($key === "password") {
					UserModule::$funcName($userId, $value, $value);
				} else {
					UserModule::$funcName($userId, $value);
				}
			}
		}
	}

	function redeemToken($response) {
		$token = TokenModule::redeemToken($_POST["code"]);
		
		if ($token["tokenType"] === TokenModule::TOKEN_TYPE_ACTIVATION) {
			$response->setSuccessMsg("account_isActivated_activation_success");
		} else if ($token["tokenType"] === TokenModule::TOKEN_TYPE_PASSWORD_RESET) {
			// send fake success response to tell the app to show the password reset form
			$response->setSuccessMsg("account_password_new");
		} else if ($token["tokenType"] === TokenModule::TOKEN_TYPE_E_MAIL_UPDATE) {
			try {
				TransferModule::getTransfer($token["userId"]);
				$response->setSuccessMsg("account_transfer_progressed");
			} catch (Exception $exc) {
				// transfer completed, hence not found anymore
				$response->setSuccessMsg("account_eMailAddress_updated");
			}
		} else if ($token["tokenType"] === TokenModule::TOKEN_TYPE_DELETION) {
			$response->setSuccessMsg("account_deletion_success");
		} else {
			throw new Exception("token_type_invalid");
		}
	}

	function resetPassword($response) {
		$token = TokenModule::getTokenByCode($_POST["code"]);
		if ($token["tokenType"] !== TokenModule::TOKEN_TYPE_PASSWORD_RESET) {
			throw new Exception("token_type_invalid");
		}

		UserModule::updatePassword($token["userId"], $_POST["password"], $_POST["password"]);
		TokenModule::deleteToken($token);
		$response->setSuccessMsg("account_password_updated");
	}

	function resendActivationMail($response) {
		UserModule::resendActivationMail($_POST["eMailAddress"]);
		$response->setSuccessMsg("mail_confirm_activation_send");
	}

	function requestPasswordReset($response) {
		UserModule::requestPasswordReset($_POST["eMailAddress"]);
		$response->setSuccessMsg("mail_password_reset_sent");
	}

	function requestAccountTransferMail($response) {
		UserModule::requestAccountTransferMail($_POST["eMailAddress"]);

		$transfer = TransferModule::getTransfer(
			UserModule::getUserIdByEMailAddress($_POST["eMailAddress"])
		);
		$response->setSuccessMsg(
			intval($transfer["oldEMailAddressConfirmed"]) === 0 ?
			"account_transfer_initialized" :
			"account_transfer_progressed"
		);
	}

	function delete($response) {
		if (isset($_COOKIE[CookieModule::getFullName("sessionHash")]) === false) {
			throw new Exception("error_message_NEP");
		}

		UserModule::requestAccountDeletion(SessionModule::getUserIdBySessionHash($_COOKIE[CookieModule::getFullName("sessionHash")]));
		$response->setSuccessMsg("account_deletion_initiiated");
	}

?>