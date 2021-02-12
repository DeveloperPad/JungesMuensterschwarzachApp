<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/EventModule.php");
	require_once(ROOT_LOCAL."/endpoints/response.php");
	
	
	$response = new Response();
	try {
		if (isset($_POST["action"]) === false) {
			throw new Exception("error_message_NEP");
		}

		$ownUser = isset($_COOKIE[CookieModule::getFullName("sessionHash")]) ?
			UserModule::loadUserBySessionHash(
				$_COOKIE[CookieModule::getFullName("sessionHash")], 
				ACCESS_LEVEL_DEVELOPER
			) :
			null;
		$_POST["action"]($ownUser, $response);
	} catch (Exception $exc) {
		$response->setErrorMsg($exc->getMessage());
	}
	
	echo(json_encode($response));


	function fetchEventList($ownUser, $response) {
		$response->setEventList(
			EventModule::loadEventList($ownUser ? $ownUser["accessLevel"] : ACCESS_LEVEL_GUEST)
		);
	}

	function fetchEvent($ownUser, $response) {
		$response->setEventList(
			array(
				EventModule::loadEvent($_POST["eventId"], $ownUser ? $ownUser["accessLevel"] : ACCESS_LEVEL_GUEST)
			)
		);
	}

	function fetchEventEnrollment($ownUser, $response) {
		if ($ownUser === null) {
			throw new Exception("error_message_account_required");
		}

		$response->setEventEnrollment(
			EventModule::loadEventEnrollment($_POST["eventId"], $ownUser["userId"], $ownUser["accessLevel"])
		);
	}

	function enroll($ownUser, $response) {
		if ($ownUser === null) {
			throw new Exception("error_message_account_required");
		}

		EventModule::enroll($ownUser["userId"], $_POST["eventId"], $_POST["eventEnrollmentComment"], $ownUser["accessLevel"]);
		$response->setSuccessMsg("event_user_enrolled");
	}

	function updateEventEnrollmentComment($ownUser, $response) {
		if ($ownUser === null) {
			throw new Exception("error_message_account_required");
		}

		EventModule::updateEventEnrollmentComment($ownUser["userId"], $_POST["eventId"], $_POST["eventEnrollmentComment"], $ownUser["accessLevel"]);
		$response->setSuccessMsg("event_eventEnrollmentComment_updated");
	}

	function disenroll($ownUser, $response) {
		if ($ownUser === null) {
			throw new Exception("error_message_account_required");
		}

		EventModule::disenroll($ownUser["userId"], $_POST["eventId"], $ownUser["accessLevel"]);
		$response->setSuccessMsg("event_user_disenrolled");
	}

?>