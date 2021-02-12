<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/MailModule.php");
	require_once(ROOT_LOCAL."/modules/TokenModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");

	if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["eMailAddress"]) === true) {
		try {
			UserModule::resendActivationMail($_POST["eMailAddress"]);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["mail_confirm_activation_send"]));
			unset($_POST["eMailAddress"]);
		} catch(Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
		}
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
				<h1 class="mb-4"><?php echo($GLOBALS["dict"]["navigation_request_activation_link"]);?></h1>
				<hr>
				<form name="resendActivationMailForm" method="POST" class="form-horizontal">
					<div class="form-group">
						<label class="control-label col-12" for="eMailAddress"><?php echo($GLOBALS["dict"]["account_eMailAddress"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-at fa-fw"></i></span>
							<input name="eMailAddress" type="email" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_eMailAddress_placeholder"]);?>"
								value="<?php if (isset($_POST["eMailAddress"]) === true) echo($_POST["eMailAddress"]);?>" required>
						</div>
					</div>
					<hr>
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