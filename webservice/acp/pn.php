<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/PushNotificationModule.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");


	$ownAccessLevel = SessionModule::getOwnAccessLevel();

	if ($ownAccessLevel < PERMISSION_PN) {
		header("Location: ../index.php");
		exit;
	}

	if ($_SERVER["REQUEST_METHOD"] === "POST") {
		try {
			$pnModule = new PushNotificationModule();
			$report = $pnModule->sendCustomNotification($_POST["requiredAccessLevel"], 
				$_POST["title"], $_POST["body"], null, $ownAccessLevel);
			unset($_POST);
			CookieModule::set("alert", new Alert("success", $report));
		} catch (Exception $exc) {
			if (isset($GLOBALS["dict"][$exc->getMessage()]) === true) {
				CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
			} else {
				CookieModule::set("alert", new Alert("danger", $exc->getMessage()));
			}
		} finally {
			unset($newsModule);
		}
	}
	
	try {
		$accessLevels = UserModule::loadAccessLevels($ownAccessLevel);
	} catch (Exception $exc) {
		$accessLevels = array();
		CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
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
				<h1><?php echo($GLOBALS["dict"]["navigation_web_pn"]);?></h1>
				<hr>
				<form name="pushNotificationForm" method="POST" class="form-horizontal">
					<div class="form-group">
						<label class="control-label col-12" for="requiredAccessLevel"><?php echo($GLOBALS["dict"]["pn_send_recipient"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-bolt fa-fw"></i></span>
							<select name="requiredAccessLevel" class="form-control">
							<?php
								foreach($accessLevels as $accessLevel) {
									echo("<option value=\"{$accessLevel["accessLevel"]}\"");
									if (isset($_POST["requiredAccessLevel"]) === true && $_POST["requiredAccessLevel"] === $accessLevel["accessLevel"]) {
										echo(" selected");
									}
									echo(">{$GLOBALS["dict"][$accessLevel["accessIdentifier"]]}+</option>");
								}
							?>
							</select>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="title"><?php echo($GLOBALS["dict"]["pn_title"]);?></label>
						<div class="col-12">
							<input name="title" type="text" class="form-control font-weight-bold" placeholder="<?php echo($GLOBALS["dict"]["pn_title_placeholder"]);?>"
								value="<?php if (isset($_POST["title"]) === true) echo(htmlspecialchars($_POST["title"]));?>" maxlength="<?php echo(PN_TITLE_MAX_LENGTH);?>" required>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="body"><?php echo($GLOBALS["dict"]["pn_message"]);?></label>
						<div class="col-12">
							<textarea name="body" class="form-control font-weight-light disable-resizing" placeholder="<?php echo($GLOBALS["dict"]["pn_message_placeholder"]);?>"
								maxlength="<?php echo(PN_BODY_MAX_LENGTH);?>" rows="4" required><?php if (isset($_POST["body"]) === true) echo(htmlspecialchars($_POST["body"]));?></textarea>
						</div>
					</div>
					<div class="form-group">
						<div class="col-12">
							<button id="submit" type="submit" class="btn btn-default"><?php echo($GLOBALS["dict"]["label_submit"]);?></button>
						</div>
					</div>
				</form>
			</div>
		</div>		
	</body>
</html>