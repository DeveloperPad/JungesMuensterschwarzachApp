<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");
	
	
	$ownAccessLevel = SessionModule::getOwnAccessLevel();
	
	if ($ownAccessLevel < PERMISSION_USER || isset($_GET["userId"]) === false) {
		header("Location: ../index.php");
		exit;
	}

	if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["userId"]) === true) {
		try {
			$accessLevels = UserModule::loadAccessLevels($ownAccessLevel);
			$_POST = UserModule::loadUser($_GET["userId"], $ownAccessLevel);
		} catch (Exception $exc) {
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
		<script src="<?php echo(ROOT_PUBLIC);?>/js/modal.js"></script>
		<script src="<?php echo(ROOT_PUBLIC);?>/js/users_edit.js"></script>
	</head>
	<body>
		<?php require(ROOT_LOCAL."/assets/navigation.php");?>
		
		<div class="container">
			<?php
				if ($cookieAlert !== null) {
					Alert::show($cookieAlert);
					if (isset($_POST["userId"]) === false) {
						return;
					}
				}
			?>
			<div class="jumbotron jma-background-color">
				<h1><?php echo($GLOBALS["dict"]["account_management"]);?></h1>
				<hr>
				<h3 class="float-left"><?php echo($GLOBALS["dict"]["account_overview"]);?></h3>
				<a href="users.php" class="btn btn-primary float-right"><?php echo($GLOBALS["dict"]["account_list_back"]);?></a>
				<div class="clearfix"></div>
				<hr>
				<form name="userEditForm" method="POST" class="form-horizontal">
					<div class="form-group">
						<label class="control-label col-12" for="userId"><?php echo($GLOBALS["dict"]["account_id"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-list-ol fa-fw"></i></span>
							<input name="userId" type="text" class="form-control" value="<?php if (isset($_GET["userId"]) === true) echo($_GET["userId"]);?>" disabled>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="accessLevel"><?php echo($GLOBALS["dict"]["account_accessLevel"]);?></label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-bolt fa-fw"></i></span>
							<select name="accessLevel" class="form-control">
							<?php
								foreach($accessLevels as $accessLevel) {
									if ($accessLevel["accessLevel"] === ACCESS_LEVEL_GUEST) {
										continue;
									}
									
									echo("<option value=\"${accessLevel["accessLevel"]}\"");
									if ($_POST["accessLevel"] === $accessLevel["accessLevel"]) {
										echo(" selected");
									}
									echo(">{$GLOBALS["dict"][$accessLevel["accessIdentifier"]]}</option>");
								}
							?>
							</select>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="firstName"><?php echo($GLOBALS["dict"]["account_firstName"]);?>
							<span class="jma-required-event"><?php echo($GLOBALS["dict"]["account_credentials_mark"]);?></span>
						</label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-address-card fa-fw"></i></span>
							<input name="firstName" type="text" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_firstName_placeholder"]);?>"
								value="<?php if (isset($_POST["firstName"]) === true) echo($_POST["firstName"]);?>" maxlength="<?php echo(FIRSTNAME_LENGTH_MAX);?>">
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="lastName"><?php echo($GLOBALS["dict"]["account_lastName"]);?>
							<span class="jma-required-event"><?php echo($GLOBALS["dict"]["account_credentials_mark"]);?></span>
						</label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-address-card fa-fw"></i></span>
							<input name="lastName" type="text" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_lastName_placeholder"]);?>"
								value="<?php if (isset($_POST["lastName"]) === true) echo($_POST["lastName"]);?>" maxlength="<?php echo(LASTNAME_LENGTH_MAX);?>">
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="displayName"><?php echo($GLOBALS["dict"]["account_displayName"]);?>
							<span class="jma-required-signUp"><?php echo($GLOBALS["dict"]["account_credentials_mark"]);?></span>
						</label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-address-card fa-fw"></i></span>
							<input name="displayName" type="text" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_displayName_placeholder"]);?>"
								value="<?php if (isset($_POST["displayName"]) === true) echo($_POST["displayName"]);?>" maxlength="<?php echo(DISPLAYNAME_LENGTH_MAX);?>" required>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="eMailAddress"><?php echo($GLOBALS["dict"]["account_eMailAddress"]);?>
							<span class="jma-required-signUp"><?php echo($GLOBALS["dict"]["account_credentials_mark"]);?></span>
							<span class="jma-required-event"><?php echo($GLOBALS["dict"]["account_credentials_mark"]);?></span>
						</label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-at fa-fw"></i></span>
							<input name="eMailAddress" type="email" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_eMailAddress_placeholder"]);?>"
								value="<?php if (isset($_POST["eMailAddress"]) === true) echo($_POST["eMailAddress"]);?>" maxlength="<?php echo(EMAILADDRESS_LENGTH_MAX);?>" required >
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="streetName"><?php echo($GLOBALS["dict"]["account_streetName"]);?>
							<span class="jma-required-event"><?php echo($GLOBALS["dict"]["account_credentials_mark"]);?></span>
						</label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-home fa-fw"></i></span>
							<input name="streetName" type="text" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_streetName_placeholder"]);?>"
								value="<?php if (isset($_POST["streetName"]) === true) echo($_POST["streetName"]);?>" maxlength="<?php echo(STREETNAME_LENGTH_MAX);?>">
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="houseNumber"><?php echo($GLOBALS["dict"]["account_houseNumber"]);?>
							<span class="jma-required-event"><?php echo($GLOBALS["dict"]["account_credentials_mark"]);?></span>
						</label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-home fa-fw"></i></span>
							<input name="houseNumber" type="text" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_houseNumber_placeholder"]);?>"
								value="<?php if (isset($_POST["houseNumber"]) === true) echo($_POST["houseNumber"]);?>" maxlength="<?php echo(HOUSENUMBER_LENGTH_MAX);?>">
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="zipCode"><?php echo($GLOBALS["dict"]["account_zipCode"]);?>
							<span class="jma-required-event"><?php echo($GLOBALS["dict"]["account_credentials_mark"]);?></span>
						</label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-home fa-fw"></i></span>
							<input name="zipCode" type="text" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_zipCode_placeholder"]);?>"
								value="<?php if (isset($_POST["zipCode"]) === true) echo($_POST["zipCode"]);?>" maxlength="<?php echo(ZIPCODE_LENGTH_MAX);?>">
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="city"><?php echo($GLOBALS["dict"]["account_city"]);?>
							<span class="jma-required-event"><?php echo($GLOBALS["dict"]["account_credentials_mark"]);?></span>
						</label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-home fa-fw"></i></span>
							<input name="city" type="text" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_city_placeholder"]);?>"
								value="<?php if (isset($_POST["city"]) === true) echo($_POST["city"]);?>" maxlength="<?php echo(CITY_LENGTH_MAX);?>">
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="country"><?php echo($GLOBALS["dict"]["account_country"]);?>
							<span class="jma-required-event"><?php echo($GLOBALS["dict"]["account_credentials_mark"]);?></span>
						</label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-globe fa-fw"></i></span>
							<input name="country" type="text" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_country_placeholder"]);?>"
								value="<?php if (isset($_POST["country"]) === true) echo($_POST["country"]);?>" maxlength="<?php echo(COUNTRY_LENGTH_MAX);?>">
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="phoneNumber"><?php echo($GLOBALS["dict"]["account_phoneNumber"]);?>
							<span class="jma-required-event"><?php echo($GLOBALS["dict"]["account_credentials_mark"]);?></span>
						</label>
						<div class="col-12 input-group">
							<span class="input-group-addon"><i class="fas fa-mobile-alt fa-fw"></i></span>
							<input name="phoneNumber" type="text" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_phoneNumber_placeholder"]);?>"
								value="<?php if (isset($_POST["phoneNumber"]) === true) echo($_POST["phoneNumber"]);?>" maxlength="<?php echo(PHONENUMBER_LENGTH_MAX); ?>">
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="birthdate"><?php echo($GLOBALS["dict"]["account_birthdate"]);?>
							<span class="jma-required-event"><?php echo($GLOBALS["dict"]["account_credentials_mark"]);?></span>
						</label>
						<div class="col-12 input-group">
							<span class="input-group-addon input-group-datepicker"><i class="fas fa-calendar-alt fa-fw"></i></span>
							<input name="birthdate" type="text" pattern="\d{4}-\d{2}-\d{2}" class="form-control" placeholder="<?php echo($GLOBALS["dict"]["account_birthdate_placeholder"]);?>"
								value="<?php if (isset($_POST["birthdate"]) === true) echo($_POST["birthdate"]);?>">
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="eatingHabits"><?php echo($GLOBALS["dict"]["account_eatingHabits"]);?>
							<span class="jma-required-event"><?php echo($GLOBALS["dict"]["account_credentials_mark"]);?></span>
						</label>
						<div class="col-12">
							<textarea name="eatingHabits" class="form-control disable-resizing" placeholder="<?php echo($GLOBALS["dict"]["account_eatingHabits_placeholder"]);?>"
								maxlength="<?php echo(EATINGHABITS_LENGTH_MAX);?>" rows="5"><?php if (isset($_POST["eatingHabits"]) === true) echo(htmlspecialchars($_POST["eatingHabits"]));?></textarea>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-12" for="allowPost"><?php echo($GLOBALS["dict"]["account_allowPost_label"]);?></label>
						<div class="col-12 input-group">
							<input name="allowPost" type="checkbox" class="ml-3" 
								<?php if (isset($_POST["allowPost"]) === true && $_POST["allowPost"] === 1) echo("checked");?>>
							<span class="ml-3"><?php echo($GLOBALS["dict"]["account_allowPost"]);?></span> 
						</div>
					</div>
					<hr>
					<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#activateUserModal" 
						data-userid="<?php echo($_GET["userId"]);?>" data-displayname="<?php echo(htmlspecialchars($_POST["displayName"]));?>"
						data-isactivated="<?php echo(1 - $_POST["isActivated"]);?>">
						<?php echo($GLOBALS["dict"][intval($_POST["isActivated"]) === 0 ? "label_activate" : "label_deactivate"]);?>
					</button>
					<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteUserModal" 
						data-userid="<?php echo($_GET["userId"]);?>" data-displayname="<?php echo(htmlspecialchars($_POST["displayName"]));?>">
						<?php echo($GLOBALS["dict"]["label_delete"]);?>
					</button>
					<hr>
					<p><?php 
						echo($GLOBALS["dict"]["label_update_last"]);
						if(isset($_POST["modificationDate"]) === true) { 
							echo($_POST["modificationDate"]); 
						} else { 
							echo("-");
						}?></p>
					<hr>
					<p>
						<span class="jma-required-signUp"><?php echo($GLOBALS["dict"]["account_credentials_mark"]);?></span>
							<?php echo($GLOBALS["dict"]["account_credentials_signUp"]);?><br>
						<span class="jma-required-event"><?php echo($GLOBALS["dict"]["account_credentials_mark"]);?></span>
							<?php echo($GLOBALS["dict"]["account_credentials_event"]);?>
					</p>
				</form>	
			</div>
		</div>
		<div class="modal fade" id="activateUserModal" tabindex="-1">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title"><strong><?php echo($GLOBALS["dict"]["label_warning"]);?></strong></h5>
						<button type="button" class="close" data-dismiss="modal">
							<i class="far fa-times-circle fa-fw"></i>
						</button>
					</div>
					<div class="modal-body">
						<p><?php echo($GLOBALS["dict"]["user_activate_modal_safeguard_1_prefix"]);?><strong></strong><?php echo($GLOBALS["dict"]["user_activate_modal_safeguard_1_suffix"]);?></p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-success"><?php echo($GLOBALS["dict"]["label_confirm"]);?></button>
						<button type="button" class="btn btn-default" data-dismiss="modal"><?php echo($GLOBALS["dict"]["label_cancel"]);?></button>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade" id="deleteUserModal" tabindex="-1">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title"><strong><?php echo($GLOBALS["dict"]["label_warning"]);?></strong></h5>
						<button type="button" class="close" data-dismiss="modal">
							<i class="far fa-times-circle fa-fw"></i>
						</button>
					</div>
					<div class="modal-body">
						<p><?php echo($GLOBALS["dict"]["user_delete_modal_safeguard_1_prefix"]);?><strong></strong><?php echo($GLOBALS["dict"]["user_delete_modal_safeguard_1_suffix"]);?></p>
						<p><?php echo($GLOBALS["dict"]["not_revertable"]);?></p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-danger"><?php echo($GLOBALS["dict"]["label_confirm"]);?></button>
						<button type="button" class="btn btn-default" data-dismiss="modal"><?php echo($GLOBALS["dict"]["label_cancel"]);?></button>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>