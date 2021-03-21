<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/NewsletterModule.php");
	require_once(ROOT_LOCAL."/endpoints/response.php");
	
	$response = new Response();
	try {
		if (isset($_POST["action"]) === false) {
			throw new Exception("error_message_NEP");
		}

		if ($_POST["action"] === "subscribe") {
			$response->setSuccessMsg(
				NewsletterModule::subscribe($_POST["eMailAddress"])
			);
		} else if ($_POST["action"] === "redeem") {
			$response->setSuccessMsg(
				NewsletterModule::redeem($_POST["code"])
			);
		} else {
			throw new Exception("error_message_NEP");
		}
	} catch (Exception $exc) {
		$response->setErrorMsg($exc->getMessage());
	}
	echo(json_encode($response));
?>