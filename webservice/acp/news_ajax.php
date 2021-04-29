<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/NewsModule.php");
	require_once(ROOT_LOCAL."/modules/PushNotificationModule.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");


	$ownAccessLevel = SessionModule::getOwnAccessLevel();
	
	if (!PERMISSIONS[$ownAccessLevel][PERMISSION_ADMIN_NEWS]) {
		return;
	}
	
	$_POST["action"]($ownAccessLevel);

	function announceNews($ownAccessLevel) {
		try {
			$report = PushNotificationModule::sendNewsNotification($_POST["newsId"], $ownAccessLevel);
			CookieModule::set("alert", new Alert("success", $report));
		} catch (Exception $exc) {
			if (isset($GLOBALS["dict"][$exc->getMessage()]) === true) {
				CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
			} else {
				CookieModule::set("alert", new Alert("danger", $exc->getMessage()));
			}
		}
	}

	function updateTitle($ownAccessLevel) {
		try {
			NewsModule::updateTitle($_POST["newsId"], $_POST["title"], $ownAccessLevel);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["news_title_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function updateSummary($ownAccessLevel) {
		try {
			NewsModule::updateSummary($_POST["newsId"], $_POST["summary"], $ownAccessLevel);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["news_summary_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function updateContent($ownAccessLevel) {
		try {
			NewsModule::updateContent($_POST["newsId"], $_POST["content"], $ownAccessLevel);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["news_content_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function updateAuthorId($ownAccessLevel) {
		try {
			NewsModule::updateAuthorId($_POST["newsId"], $_POST["authorId"], $ownAccessLevel);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["news_authorId_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function updatePostingDate($ownAccessLevel) {
		try {
			NewsModule::updatePostingDate($_POST["newsId"], $_POST["postingDate"], $ownAccessLevel);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["news_postingDate_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}

	function updateRequiredAccessLevel($ownAccessLevel) {
		try {
			NewsModule::updateRequiredAccessLevel($_POST["newsId"], $_POST["requiredAccessLevel"], $ownAccessLevel);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["news_requiredAccessLevel_updated"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		} finally {
			unset($newsModule);
		}
	}

	function deleteNews($ownAccessLevel) {
		try {
			NewsModule::deleteNews($_POST["newsId"], $ownAccessLevel);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["news_deletion_success"]));
		} catch (Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
	}
	
?>