<?php
	require_once("./assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/CookieModule.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");
	
	
	if (isset($_COOKIE[CookieModule::getFullName("accessLevel")]) === true) {
		header("Location: ./index.php");
		exit();
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
			<div class="jumbotron jma-background-color">
				<h1 class="mb-4"><?php echo($GLOBALS["dict"]["account_sign_in_form"]);?></h1>
				<form name="loginForm" method="POST" onSubmit="return false;" class="form-horizontal">
					<div class="form-group">
						<label class="control-label col-12" for="eMailAddress"><?php echo($GLOBALS["dict"]["account_eMailAddress"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-at fa-fw"></i></span>
							<input name="eMailAddress" type="email" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_eMailAddress_placeholder"]);?>"
								value="<?php if (isset($_POST["eMailAddress"]) === true) echo($_POST["eMailAddress"]);?>" required>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="password"><?php echo($GLOBALS["dict"]["account_password"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-key fa-fw"></i></span>
							<input name="password" type="password" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_password_placeholder"]);?>"
								value="<?php if (isset($_POST["password"]) === true) echo($_POST["password"]);?>" minlength="4" required>
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