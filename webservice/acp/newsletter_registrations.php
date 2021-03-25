<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/NewsletterModule.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");

	
	$ownAccessLevel = SessionModule::getOwnAccessLevel();

	if ($ownAccessLevel < PERMISSION_NEWSLETTER) {
		header("Location: ../index.php");
		exit;
	}

	function printRegistrations($registrations)  {
		?>
		<div class="list-group">
		<?php
			printHeader();
			foreach ($registrations as $registration) {
				printRow($registration);
			}
			?>
		</div>
		<?php
	}

	function printHeader() {
		?>
		<div class="row list-group-item">
			<div class="d-flex w-100 text-center">
				<div class="col-8">
					<strong><?php echo($GLOBALS["dict"]["account_eMailAddress"]);?></strong>
				</div>
				<div class="col-4">
					<strong><?php echo($GLOBALS["dict"]["account_accessLevel"]);?></strong>
				</div>
			</div>
		</div>
		<?php
	}

	function printRow($registration) {
		?>
		<div class="row list-group-item">
			<div class="d-flex w-100 text-center align-items-center">
				<div class="col-8">
					<?php echo($registration["eMailAddress"]);?>
				</div>
				<div class="col-4">
					<span class="badge badge-pill <?php echo(GlobalFunctions::getAccessBadge($registration["accessLevel"]));?>"><?php echo($GLOBALS["dict"][$registration["accessIdentifier"]]);?></span>
				</div>
			</div>
		</div>
		<?php
	}

	try {
		$registrations = NewsletterModule::loadRegistrations();
	} catch(Exception $exc) {
		CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		$registrations = array();
	}

	$cookieAlert = CookieModule::get("alert");
	CookieModule::remove("alert");
?>
<!DOCTYPE html>
<html lang="de">
	<head>
		<?php require(ROOT_LOCAL."/assets/head.php");?>
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
				<h1><?php echo($GLOBALS["dict"]["navigation_newsletters"]);?></h1>
				<hr>
				<h3 class="float-left"><?php echo($GLOBALS["dict"]["newsletter_registrations"]);?></h3>
				<a href="newsletter_create.php" class="btn btn-primary float-right"><?php echo($GLOBALS["dict"]["newsletter_add"]);?></a>
				<div class="clearfix"></div>
				<hr>
				<?php printRegistrations($registrations); ?>
			</div>
		</div>	
	</body>
</html>