<?php 
	require_once("./assets/global_requirements.php");
	require_once("./modules/CookieModule.php");

	if (isset($_COOKIE[CookieModule::getFullName("userId")]) === false) {
		CookieModule::remove("accessLevel");
		CookieModule::remove("accessIdentifier");
	}
	
	// handled by JavaScript
?>
<!DOCTYPE html>
<html lang="de">
	<head>
		<?php require(ROOT_LOCAL."/assets/head.php");?>
	</head>
	<body>
		<?php require(ROOT_LOCAL."/assets/navigation.php");?>
		
		<div class="container">
			<div class="logoutForm">
				<div class="jumbotron jma-background-color">
					<h1><?php echo($GLOBALS["dict"]["account_sign_out"] . "..."); ?></h1>
				</div>
			</div>
		</div>
	</body>
</html>