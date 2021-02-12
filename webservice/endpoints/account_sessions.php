<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/CookieModule.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");
	require_once(ROOT_LOCAL."/endpoints/response.php");
	
	$response = new Response();
	try {
		if (isset($_POST["action"]) === false) {
			throw new Exception("error_message_NEP");
		}

		if ($_POST["action"] === "signIn") {
			if (isset($_POST["eMailAddress"]) && isset($_POST["password"])) {
				$session = SessionModule::signInByCredentials(
					$_POST["eMailAddress"],
					$_POST["password"]
				);
				CookieModule::remove("alert");
			} else {
				try {
					$session = SessionModule::signInBySessionHash(
						$_COOKIE[CookieModule::getFullName("sessionHash")] ?? null
					);
				} catch (Exception $exc) {
					$session = SessionModule::signInByOTP(
						$_COOKIE[CookieModule::getFullName("OTP")] ?? null
					);
				}
			}

			$user = UserModule::loadUserBySessionHash(
				$session["sessionHash"],
				ACCESS_LEVEL_DEVELOPER
			);

			CookieModule::set("sessionHash", $session["sessionHash"], true);
			CookieModule::set("OTP", $session["OTP"], true);
			CookieModule::set("accessIdentifier", $user["accessIdentifier"]);
			CookieModule::set("accessLevel", $user["accessLevel"]);
			CookieModule::set("displayName", $user["displayName"]);
			CookieModule::set("userId", $user["userId"]);
		} else if ($_POST["action"] === "signOut") {
			SessionModule::signOut($_COOKIE[CookieModule::getFullName("sessionHash")]);
			CookieModule::remove("sessionHash");
			CookieModule::remove("OTP");
			CookieModule::remove("accessIdentifier");
			CookieModule::remove("accessLevel");
			CookieModule::remove("displayName");
			CookieModule::remove("userId");
			CookieModule::remove("alert");
		} else {
			throw new Exception("error_message_NEP");
		}
	} catch (Exception $exc) {
		CookieModule::remove("sessionHash");
		CookieModule::remove("OTP");
		CookieModule::remove("accessIdentifier");
		CookieModule::remove("accessLevel");
		CookieModule::remove("displayName");
		CookieModule::remove("userId");
		$response->setErrorMsg($exc->getMessage());
	}
	echo(json_encode($response));
?>