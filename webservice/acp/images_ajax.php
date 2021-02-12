<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/ImageModule.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");

	$ownAccessLevel = SessionModule::getOwnAccessLevel();
	
	if ($ownAccessLevel < PERMISSION_IMAGES) {
		return;
	}
	
	$_POST["action"]($ownAccessLevel);

	function deleteImage($ownAccessLevel) {
		try {
			ImageModule::deleteImage($_POST["imageId"], $ownAccessLevel);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["image_deleted"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}
	
?>