<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");
	require_once(ROOT_LOCAL."/modules/TokenModule.php");


	$ownAccessLevel = SessionModule::getOwnAccessLevel();

	if ($ownAccessLevel < PERMISSION_USER) {
		header("Location: ../index.php");
		exit;
	}

	function printTokenTable($tokenList)  {
		?>
		<div class="list-group">
		<?php
			printHeader();
			foreach ($tokenList as $token) {
				printRow($token);
			}
			?>
		</div>
		<?php
	}

	function printHeader() {
		?>
		<div class="row list-group-item">
			<div class="d-flex w-100 text-center">
				<div class="col-3">
					<span><strong><?php echo($GLOBALS["dict"]["token_code"]);?></strong></span>
				</div>
				<div class="col-3">
					<span><strong><?php echo($GLOBALS["dict"]["token_type"]);?></strong></span>
				</div>
				<div class="col-3">
					<span><strong><?php echo($GLOBALS["dict"]["account_displayName"]);?></strong></span>
				</div>
				<div class="col-3">
					<span><strong><?php echo($GLOBALS["dict"]["token_valid_until"]);?></strong></span>
				</div>
			</div>
		</div>
		<?php
	}

	function printRow($token) {
		?>
		<div class="row list-group-item">
			<div class="d-flex w-100 text-center align-items-center">
				<div class="col-3">
					<span><?php echo($token["code"]);?></span>
				</div>
				<div class="col-3">
					<span><?php echo($token["tokenType"]);?></span>
				</div>
				<div class="col-3">
					<span><?php echo($token["displayName"]); ?></span>
				</div>
				<div class="col-3">
					<span><?php echo($token["validUntil"]);?></span>
				</div>
			</div>
		</div>
		<?php
	}

	try {
		$tokenList = TokenModule::getTokenList();
	} catch(Exception $exc) {
		CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		$tokenList = array();
	}

	$cookieAlert = CookieModule::get("alert");
	CookieModule::remove("alert");
?>
<!DOCTYPE html>
<html lang="de">
	<head>
		<?php require(ROOT_LOCAL."/assets/head.php");?>
		<script src="<?php echo(ROOT_PUBLIC);?>/js/modal.js"></script>
	</head>
	<body>
		<?php require(ROOT_LOCAL."/assets/navigation.php");?>
		
		<div class="container">
			<?php
				if ($cookieAlert !== null) {
					Alert::show($cookieAlert);
				}
			?>
			<div class="jumbotron jma-background-color">
				<h1><?php echo($GLOBALS["dict"]["navigation_web_token_list"]);?></h1>
				<hr>
				<?php printTokenTable($tokenList); ?>
			</div>
		</div>		
	</body>
</html>