<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");
	require_once(ROOT_LOCAL."/modules/TokenModule.php");


	$ownAccessLevel = SessionModule::getOwnAccessLevel();
	
	if ($ownAccessLevel < PERMISSION_USER) {
		return;
	}
	
	$_POST["action"]($ownAccessLevel);
	
	function updateAccessLevel($ownAccessLevel) {
		try {
			UserModule::updateAccessLevel($_POST["userId"], $_POST["accessLevel"], $ownAccessLevel);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_accessLevel_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}
	
	function updateFirstName($ownAccessLevel) {
		try {
			UserModule::updateFirstName($_POST["userId"], $_POST["firstName"]);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_firstName_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}
	
	function updateLastName($ownAccessLevel) {
		try {
			UserModule::updateLastName($_POST["userId"], $_POST["lastName"]);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_lastName_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}
	
	function updateDisplayName($ownAccessLevel) {
		try {
			UserModule::updateDisplayName($_POST["userId"], $_POST["displayName"]);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_displayName_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}
	
	function updateEMailAddress($ownAccessLevel) {
		try {
			UserModule::initiateAccountTransfer($_POST["userId"], $_POST["eMailAddress"]);
			CookieModule::set("alert", new Alert("warning", $GLOBALS["dict"]["account_transfer_initialized"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function updateStreetName($ownAccessLevel) {
		try {		
			UserModule::updateStreetName($_POST["userId"], $_POST["streetName"]);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_streetName_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function updateHouseNumber($ownAccessLevel) {
		try {	
			UserModule::updateHouseNumber($_POST["userId"], $_POST["houseNumber"]);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_houseNumber_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function updateSupplementaryAddress($ownAccessLevel) {
		try {	
			UserModule::updateSupplementaryAddress($_POST["userId"], $_POST["supplementaryAddress"]);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_supplementaryAddress_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function updateZipCode($ownAccessLevel) {
		try {	
			UserModule::updateZipCode($_POST["userId"], $_POST["zipCode"]);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_zipCode_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function updateCity($ownAccessLevel) {
		try {		
			UserModule::updateCity($_POST["userId"], $_POST["city"]);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_city_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function updateCountry($ownAccessLevel) {
		try {	
			UserModule::updateCountry($_POST["userId"], $_POST["country"]);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_country_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function updatePhoneNumber($ownAccessLevel) {
		try {	
			UserModule::updatePhoneNumber($_POST["userId"], $_POST["phoneNumber"]);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_phoneNumber_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function updateBirthdate($ownAccessLevel) {
		try {		
			UserModule::updateBirthdate($_POST["userId"], $_POST["birthdate"]);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_birthdate_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function updateEatingHabits($ownAccessLevel) {
		try {		
			UserModule::updateEatingHabits($_POST["userId"], $_POST["eatingHabits"]);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_eatingHabits_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function updateAllowPost($ownAccessLevel) {
		try {		
			UserModule::updateAllowPost($_POST["userId"], $_POST["allowPost"]);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_allowPost_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function updateAllowNewsletter($ownAccessLevel) {
		try {		
			UserModule::updateAllowNewsletter($_POST["userId"], $_POST["allowNewsletter"]);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_allowNewsletter_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function updateIsActivated($ownAccessLevel) {
		try {
			UserModule::updateIsActivated($_POST["userId"], $_POST["isActivated"]);
			TokenModule::deleteToken(TokenModule::getTokenByUserId($_POST["userId"]));
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"][
				intval($_POST["isActivated"]) === 0 ? 
					"account_isActivated_deactivation_success" : "account_isActivated_activation_success"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}
	
	function deleteUser($ownAccessLevel) {
		try {
			$userId = $_POST["userId"];
			$user = UserModule::loadUser($userId, $ownAccessLevel);

			if (intval($user["isActivated"]) === 0) {
				UserModule::deleteUser($userId);
				CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_deletion_success"]));
			} else {
				UserModule::requestAccountDeletion($userId);
				CookieModule::set("alert", new Alert("warning", $GLOBALS["dict"]["account_deletion_initiiated"]));
			}
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}
	
?>