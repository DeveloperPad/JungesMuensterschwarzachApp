<?php
	require_once("../assets/global_requirements.php");
	require_once(ROOT_LOCAL."/modules/SessionModule.php");
	require_once(ROOT_LOCAL."/modules/UserModule.php");


	$ownAccessLevel = SessionModule::getOwnAccessLevel();
	
	if (!PERMISSIONS[$ownAccessLevel][PERMISSION_ADMIN_USER_EDIT]) {
		header("Location: ../index.php");
		exit;
	}
	
	function printTable($userList) {
		?>
		<div class="list-group">
		<?php
			printHeader();
			foreach($userList as $user) {
				printRow($user);
			}
		?>
		</div>
		<?php
	}
	
	function printHeader() {
		?>
		<div class="row list-group-item">
			<div class="d-flex w-100 text-center">
				<div class="col-2 my-auto">
					<span><strong><?php echo($GLOBALS["dict"]["account_id"]);?></strong></span>
				</div>
				<div class="col-3 my-auto">
					<span><strong><?php echo($GLOBALS["dict"]["account_displayName"]);?></strong></span>
				</div>
				<div class="col-4 my-auto">
					<span><strong><?php echo($GLOBALS["dict"]["account_eMailAddress"]);?></strong></span>
				</div>
				<div class="col-3 my-auto">
					<span><strong><?php echo($GLOBALS["dict"]["label_manage"]);?></strong></span>
				</div>
			</div>
		</div>
		<?php
	}
	
	function printRow($user) {
		?>
		<div class="row list-group-item">
			<div class="d-flex w-100 text-center align-items-center">
				<div class="col-2 col-user-userid">
					<span><?php echo($user["userId"]);?></span>
				</div>
				<div class="col-3 col-user-displayname">
					<span><?php echo($user["displayName"]);?></span>
				</div>
				<div class="col-4 col-user-emailaddress">
					<span><?php echo($user["eMailAddress"]);?></span>
				</div>
				<div class="col-3 col-user-manage">
					<a href="users_edit.php?userId=<?php echo($user["userId"]);?>"><i class="far fa-edit fa-fw text-dark mx-1"></i></a>
					<?php $activationIconClasses = intval($user["isActivated"]) === 0 ? "fas fa-lock" : "fas fa-unlock"; ?>
					<a href="#" class="<?php echo($activationIconClasses);?> fa-fw text-dark mx-1" data-toggle="modal" data-target="#activateUserModal"
						data-userid="<?php echo($user["userId"]);?>" data-displayname="<?php echo(htmlspecialchars($user["displayName"]));?>"
						data-isactivated="<?php echo(1 - $user["isActivated"]);?>"></a>
					<a href="#" class="far fa-trash-alt fa-fw text-danger mx-1" data-toggle="modal" data-target="#deleteUserModal" 
						data-userid="<?php echo($user["userId"]);?>" data-displayname="<?php echo(htmlspecialchars($user["displayName"]));?>"></a>
				</div>
			</div>
		</div>
		<?php
	}

	try {
		$accessLevels = UserModule::loadAccessLevels($ownAccessLevel);
		$userObjectList = UserModule::loadUserList($ownAccessLevel);
	} catch(Exception $exc) {
		CookieModule::set("alert", new Alert("danger", $GLOBALS["dict"][$exc->getMessage()]));
	}
	
	$cookieAlert = CookieModule::get("alert");
	CookieModule::remove("alert");
?>
<!DOCTYPE html>
<html lang="de">
	<head>
		<?php require(ROOT_LOCAL."/assets/head.php");?>
		<script src="../js/modal.js"></script>
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
				<h1><?php echo($GLOBALS["dict"]["account_management"]);?></h1>
				<hr>
				<h3 class="float-left"><?php echo($GLOBALS["dict"]["account_list"]);?></h3>
				<a href="users_create.php" class="btn btn-primary float-right"><?php echo($GLOBALS["dict"]["account_add"]);?></a>
				<div class="clearfix"></div>

				<?php 
					foreach ($accessLevels as $accessLevel) {
						if ($accessLevel["accessLevel"] === ACCESS_LEVEL_GUEST) {
							continue;
						}

						$userList = array_filter($userObjectList, function($user) use(&$accessLevel) {
							return $user["accessLevel"] === $accessLevel["accessLevel"];
						});
				?>
						<hr>
						<div class="d-flex w-100 text-center align-items-center">
							<div class="col-2">
								<span class="badge badge-pill <?php echo(GlobalFunctions::getAccessBadge($accessLevel["accessLevel"]));?> mb-3"><?php echo($GLOBALS["dict"][$accessLevel["accessIdentifier"]]);?></span>
							</div>
						</div>
				<?php
						printTable($userList);
					}
				?>
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