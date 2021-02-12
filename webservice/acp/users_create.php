<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");
	
	
	if (SessionModule::getOwnAccessLevel() < PERMISSION_USER) {
		header("Location: ../index.php");
		exit;
	}
	
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
				if ($_SERVER["REQUEST_METHOD"] === "POST") {
					try {
						UserModule::signUp(
							$_POST["displayName"], $_POST["eMailAddress"], 
							$_POST["password"], $_POST["passwordRepetition"]
						);
						unset($_POST);
						$alert = new Alert("warning", $GLOBALS["dict"]["account_creation_success"]);
					} catch (Exception $exc) {
						if (strpos($exc->getMessage(), "password") !== false) {
							unset($_POST["password"]);
							unset($_POST["passwordRepetition"]);
						}
						$alert = new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]);
					} finally {
						Alert::show($alert);
					}
				}
			?>
			<div class="jumbotron jma-background-color">
				<h1><?php echo($GLOBALS["dict"]["account_management"]);?></h1>
				<hr>
				<h3 class="float-left"><?php echo($GLOBALS["dict"]["account_add"]);?></h3>
				<a href="users.php" class="btn btn-primary float-right"><?php echo($GLOBALS["dict"]["account_list_back"]);?></a>
				<div class="clearfix"></div>
				<hr>
				<form name="registerForm" method="POST" class="form-horizontal">
					<div class="form-group">
						<label class="control-label col-12" for="displayName"><?php echo($GLOBALS["dict"]["account_displayName"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-address-card fa-fw"></i></span>
							<input name="displayName" type="text" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_displayName_placeholder"]);?>"
								value="<?php if (isset($_POST["displayName"]) === true) echo($_POST["displayName"]);?>" maxlength="<?php echo(DISPLAYNAME_LENGTH_MAX);?>" required>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="eMailAddress"><?php echo($GLOBALS["dict"]["account_eMailAddress"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-at fa-fw"></i></span>
							<input name="eMailAddress" type="email" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_eMailAddress_placeholder"]);?>"
								value="<?php if (isset($_POST["eMailAddress"]) === true) echo($_POST["eMailAddress"]);?>" maxlength="<?php echo(EMAILADDRESS_LENGTH_MAX);?>" required>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="password"><?php echo($GLOBALS["dict"]["account_password"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-key fa-fw"></i></span>
							<input name="password" type="password" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_password_placeholder"]);?>"
								value="<?php if (isset($_POST["password"]) === true) echo($_POST["password"]);?>" minlength="<?php echo(PASSWORD_LENGTH_MIN);?>" required>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="passwordRepetition"><?php echo($GLOBALS["dict"]["account_passwordRepetition"]);?></label>
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
		</div>
	</body>
</html>