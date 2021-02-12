<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/PushSubscriptionModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");
	require_once(ROOT_LOCAL."/endpoints/response.php");
	
	$response = new Response();
	try {
		if (isset($_POST["action"]) === false) {
			throw new Exception("error_message_NEP");
		}

		switch ($_POST["action"]) {
			case "subscribe":
				PushSubscriptionModule::subscribe(
					empty($_POST["endpoint"]) ? null : $_POST["endpoint"],
					empty($_POST["keyAuth"]) ? null : $_POST["keyAuth"],
					empty($_POST["keyPub"]) ? null : $_POST["keyPub"],
					empty($_POST["userId"]) ? null : $_POST["userId"]
				);
				$response->setSuccessMsg("account_push_subscription_subscribed");
				break;
			case "unsubscribe":
				PushSubscriptionModule::unsubscribe(
					empty($_POST["endpoint"]) ? null : $_POST["endpoint"]
				);
				$response->setSuccessMsg("account_push_subscription_unsubscribed");
				break;
			default:
				throw new Exception("error_message_NEP");
				break;
		}
	} catch (Exception $exc) {
		$response->setErrorMsg($exc->getMessage());
	}
	echo(json_encode($response));
?>