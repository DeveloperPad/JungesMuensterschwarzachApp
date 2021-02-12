<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/NewsModule.php");
	require_once(ROOT_LOCAL."/endpoints/response.php");
	
	
	$response = new Response();
	try {
		$accessLevel = isset($_COOKIE[CookieModule::getFullName("sessionHash")]) ?
			UserModule::loadUserBySessionHash(
				$_COOKIE[CookieModule::getFullName("sessionHash")],
				ACCESS_LEVEL_DEVELOPER
			)["accessLevel"] :
			ACCESS_LEVEL_GUEST;
		
		if (isset($_POST["newsId"]) === true) {
			$news = NewsModule::loadNewsArticle($_POST["newsId"], $accessLevel);
		} else {
			$news = NewsModule::loadNewsList(null, $accessLevel);
		}

		$response->setNews($news);
	} catch (Exception $exc) {
		$response->setErrorMsg($exc->getMessage());
	}
	
	echo(json_encode($response));
?>