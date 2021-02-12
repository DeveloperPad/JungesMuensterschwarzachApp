<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/TokenModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");

	$showForm = "showCodeRedemptionForm";
	if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["code"]) === true) {
		try {
			$token = TokenModule::redeemToken($_GET["code"]);
			if ($token["tokenType"] === TokenModule::TOKEN_TYPE_PASSWORD_RESET) {
				$showForm = "showPasswordResetForm";
			} else {
				$showForm = "showNothing";
				if ($token["tokenType"] === TokenModule::TOKEN_TYPE_ACTIVATION) {
					CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_isActivated_activation_success"]));
				} else if ($token["tokenType"] === TokenModule::TOKEN_TYPE_DELETION) {
					CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_deletion_success"]));
				}
			}
		} catch(Exception $exc) {
			CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
			unset($_GET["code"]);
		}
	} else if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_GET["code"]) === true
			&& isset($_POST["password"]) === true && isset($_POST["passwordRepetition"]) === true) {
		try {
			$token = TokenModule::getTokenByCode($_GET["code"]);
			if ($token["tokenType"] !== TokenModule::TOKEN_TYPE_PASSWORD_RESET) {
				throw new Exception("token_type_invalid");
			}

			$showForm = "showPasswordResetForm";
			UserModule::updatePassword($token["userId"], $_POST["password"], $_POST["passwordRepetition"]);
			TokenModule::deleteToken($token);
			CookieModule::set("alert", new Alert("success", $GLOBALS["dict"]["account_password_updated"]));
			$showForm = "showNothing";
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

				$showForm();
			?>
		</div>
	</body>
</html>
<?php
	function showCodeRedemptionForm() {
?>
	<div class="jumbotron jma-background-color">
		<h1 class="mb-4"><?php echo($GLOBALS["dict"]["navigation_redeem_token"]);?></h1>
		<hr>
		<form name="tokenRedemptionForm" method="GET" class="form-horizontal">
			<div class="form-group">
				<label class="control-label col-12" for="code"><?php echo($GLOBALS["dict"]["token_code"]);?></label>
				<div class="col-12 input-group">
					<span class="input-group-addon"><i class="fas fa-unlock-alt fa-fw"></i></span>
					<input name="code" type="text" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["token_code_placeholder"]);?>"
						value="<?php if (isset($_GET["code"]) === true) echo($_GET["code"]);?>" required>
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
<?php
	}
	function showPasswordResetForm() {
?>
	<div class="jumbotron jma-background-color">
		<h1 class="mb-4"><?php echo($GLOBALS["dict"]["navigation_redeem_token"]);?></h1>
		<hr>
		<form name="passwordResetForm" method="POST" class="form-horizontal">
			<div class="form-group">
				<label class="control-label col-12" for="password"><?php echo($GLOBALS["dict"]["account_password_new"]);?></label>
				<div class="col-12 input-group">
					<span class="input-group-addon"><i class="fas fa-key fa-fw"></i></span>
					<input name="password" type="password" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_password_new_placeholder"]);?>"
						value="<?php if (isset($_POST["password"]) === true) echo($_POST["password"]);?>" minlength="<?php echo(PASSWORD_LENGTH_MIN);?>" required>
				</div>
			</div>
			<div class="form-group">
				<label class="control-label col-12" for="passwordRepetition"><?php echo($GLOBALS["dict"]["account_passwordRepetition_new"]);?></label>
				<div class="col-12 input-group">
					<span class="input-group-addon"><i class="fas fa-key fa-fw"></i></span>
					<input name="passwordRepetition" type="password" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_passwordRepetition_placeholder"]);?>"
						value="<?php if (isset($_POST["passwordRepetition"]) === true) echo($_POST["passwordRepetition"]);?>" minlength="<?php echo(PASSWORD_LENGTH_MIN);?>" required>
				</div>
			</div>
			<hr>
			<div class="form-group mt-4">
				<div class="col-12 input-group">
					<span class="input-group-addon"><i class="fas fa-save fa-fw"></i></span>
					<button id="submit" type="submit" class="btn btn-success"><?php echo($GLOBALS["dict"]["label_submit"]);?></button>
				</div>
			</div>
		</form>
	</div>
<?php
	}
	function showNothing() {
	}
?>