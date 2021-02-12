<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/ImageModule.php");
	require_once(ROOT_LOCAL."/endpoints/response.php");

	
	$response = new Response();
	try {
		$response->setImage(ImageModule::downloadImage($_POST["imageId"]));
	} catch (Exception $exc) {
		$response->setErrorMsg($exc->getMessage());
	}
	
	echo(json_encode($response));
?>